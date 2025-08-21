import express from "express";
import KBArticle from "../models/KBArticle.js";

const router = express.Router();

// 🟢 Search KB
router.get("/", async (req, res) => {
  const query = req.query.query || "";
  const results = await KBArticle.find({ question: new RegExp(query, "i") });
  res.json(results);
});

// 🟢 Create article
router.post("/", async (req, res) => {
  const article = await KBArticle.create(req.body);
  res.json(article);
});

// 🟢 Update article
router.put("/:id", async (req, res) => {
  const article = await KBArticle.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(article);
});

// 🟢 Delete article
router.delete("/:id", async (req, res) => {
  await KBArticle.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

export default router;

