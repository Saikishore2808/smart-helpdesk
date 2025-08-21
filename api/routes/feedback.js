// backend/routes/feedback.js
import express from "express";
import Ticket from "../models/Ticket.js"; // adjust path
import mongoose from "mongoose";

const router = express.Router();

// POST /api/feedback
router.post("/", async (req, res) => {
  try {
    const { ticketId, feedback } = req.body; // feedback: "up" or "down"

    if (!["up", "down"].includes(feedback)) {
      return res.status(400).json({ error: "Invalid feedback value" });
    }

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });

    ticket.aiFeedback = feedback; // add aiFeedback field in Ticket model if not exist
    await ticket.save();

    res.json({ message: "Feedback saved", ticketId, feedback });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
