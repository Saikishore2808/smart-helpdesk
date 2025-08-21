import express from "express";
import AuditLog from "../models/AuditLog.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/tickets/:id/audit
router.get("/tickets/:id/audit", protect, async (req, res) => {
  try {
    const logs = await AuditLog.find({ ticketId: req.params.id }).sort({ timestamp: 1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
