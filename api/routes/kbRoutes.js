import express from "express";
import Article from "../models/Article.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// @desc    Create new KB article
// @route   POST /api/kb
// @access  Admin
router.post("/", protect, isAdmin, async (req, res) => {
  try {
    const article = await Article.create(req.body);
    res.status(201).json(article);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// @desc    Get KB articles (with optional search)
// @route   GET /api/kb?query=...
// @access  Protected
router.get("/", protect, async (req, res) => {
  try {
    const query = req.query.query || "";
    const articles = await Article.find({
      $or: [
        { title: new RegExp(query, "i") },
        { body: new RegExp(query, "i") },
        { tags: { $in: [query] } }
      ]
    });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @desc    Update KB article
// @route   PUT /api/kb/:id
// @access  Admin
router.put("/:id", protect, isAdmin, async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(article);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// @desc    Delete KB article
// @route   DELETE /api/kb/:id
// @access  Admin
router.delete("/:id", protect, isAdmin, async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id);
    res.json({ message: "Article deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
