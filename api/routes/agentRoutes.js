import express from "express";
import AgentSuggestion from "../models/AgentSuggestion.js";

const router = express.Router();

router.post("/suggestion/:id/feedback", async (req, res) => {
  const { feedback } = req.body; // "up" or "down"
  try {
    const suggestion = await AgentSuggestion.findById(req.params.id);
    if (!suggestion) return res.status(404).json({ error: "Not found" });
    suggestion.feedback = feedback;
    await suggestion.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
