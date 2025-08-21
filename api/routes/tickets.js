import express from "express";
import Ticket from "../models/Ticket.js";
const router = express.Router();

// PATCH /api/tickets/:id/feedback
router.patch("/:id/feedback", async (req, res) => {
  try {
    const { feedback } = req.body; // "up" or "down"
    if (!["up", "down"].includes(feedback)) {
      return res.status(400).json({ error: "Invalid feedback" });
    }

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });

    ticket.aiFeedback = feedback; // save feedback
    await ticket.save();

    res.json({ aiFeedback: ticket.aiFeedback });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
