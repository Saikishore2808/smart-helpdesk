import express from "express";
import Ticket from "../models/Ticket.js";
import KBArticle from "../models/KBArticle.js";
import AgentSuggestion from "../models/AgentSuggestion.js";
import AuditLog from "../models/AuditLog.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// Deterministic LLM stub
function classifyTicket(text) {
  let predictedCategory = "other";
  let confidence = 0.5;

  const lower = text.toLowerCase();
  if (lower.includes("refund") || lower.includes("invoice")) {
    predictedCategory = "billing";
    confidence = 0.9;
  } else if (lower.includes("error") || lower.includes("bug") || lower.includes("stack")) {
    predictedCategory = "tech";
    confidence = 0.85;
  } else if (lower.includes("delivery") || lower.includes("shipment")) {
    predictedCategory = "shipping";
    confidence = 0.8;
  }

  return { predictedCategory, confidence };
}

function draftReply(ticket, kbArticles) {
  const citations = kbArticles.map(a => a._id.toString());
  const kbList = kbArticles.map((a, i) => `${i + 1}. ${a.title}`).join("\n");

  const draftReply = `Hello ${ticket.createdByName || "User"},\n\nWe have reviewed your ticket:\n"${ticket.description}"\n\nBased on our knowledge base:\n${kbList}\n\nPlease follow the above guidance.`;

  return { draftReply, citations };
}

// POST /api/agent/triage
router.post("/triage", async (req, res) => {
  const { ticketId } = req.body;
  const traceId = uuidv4();

  try {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });

    // 1️⃣ Log TICKET_RETRIEVED
    await AuditLog.create({
      ticketId: ticket._id,
      traceId,
      actor: "system",
      action: "TICKET_RETRIEVED",
      meta: {},
    });

    // 2️⃣ Classify ticket
    const { predictedCategory, confidence } = classifyTicket(ticket.description);

    await AuditLog.create({
      ticketId: ticket._id,
      traceId,
      actor: "system",
      action: "CLASSIFIED",
      meta: { predictedCategory, confidence },
    });

    // 3️⃣ Retrieve KB
    const kbArticles = await KBArticle.find({
      status: "published",
      $or: [
        { title: { $regex: predictedCategory, $options: "i" } },
        { body: { $regex: predictedCategory, $options: "i" } },
        { tags: { $in: [predictedCategory] } },
      ],
    }).limit(3);

    await AuditLog.create({
      ticketId: ticket._id,
      traceId,
      actor: "system",
      action: "KB_RETRIEVED",
      meta: { articleIds: kbArticles.map(a => a._id) },
    });

    // 4️⃣ Draft reply
    const { draftReply, citations } = draftReply(ticket, kbArticles);

    // 5️⃣ Save AgentSuggestion
    const suggestion = await AgentSuggestion.create({
      ticketId: ticket._id,
      predictedCategory,
      articleIds: citations,
      draftReply,
      confidence,
      autoClosed: false,
      modelInfo: { provider: "stub", promptVersion: "v1", latencyMs: 1 },
    });

    await AuditLog.create({
      ticketId: ticket._id,
      traceId,
      actor: "system",
      action: "AGENT_SUGGESTION_CREATED",
      meta: { suggestionId: suggestion._id },
    });

    // 6️⃣ Auto-close logic
    const AUTO_CLOSE_ENABLED = process.env.AUTOCLOSEENABLED === "true";
    const CONF_THRESHOLD = parseFloat(process.env.CONFIDENCETHRESHOLD || 0.8);

    if (AUTO_CLOSE_ENABLED && confidence >= CONF_THRESHOLD) {
      ticket.status = "resolved";
      suggestion.autoClosed = true;
      await suggestion.save();
      await ticket.save();

      await AuditLog.create({
        ticketId: ticket._id,
        traceId,
        actor: "system",
        action: "AUTO_CLOSED",
        meta: {},
      });
    } else {
      ticket.status = "waiting_human";
      await ticket.save();
    }

    res.json({ suggestion, traceId });
  } catch (err) {
    console.error("❌ Triage error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
