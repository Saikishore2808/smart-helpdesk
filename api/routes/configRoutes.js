import express from "express";
import Config from "../models/configModel.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get current config
router.get("/", protect, async (req, res) => {
  const config = await Config.findOne() || await Config.create({});
  res.json(config);
});

// Update config
router.put("/", protect, async (req, res) => {
  const config = await Config.findOne() || await Config.create({});
  config.autoCloseEnabled = req.body.autoCloseEnabled ?? config.autoCloseEnabled;
  config.confidenceThreshold = req.body.confidenceThreshold ?? config.confidenceThreshold;
  await config.save();
  res.json(config);
});

export default router;
