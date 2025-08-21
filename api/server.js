import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import morgan from "morgan";
import ticketRoutes from "./routes/tickets.js";
import agentRoutes from "./routes/agent.js";
import kbRoutes from "./routes/kb.js";
import auditRoutes from "./routes/auditRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import configRoutes from "./routes/configRoutes.js";
import { requestLogger } from "./middleware/logger.js";
import notificationRoutes from "./routes/notifications.js";
import feedbackRoutes from "./routes/feedback.js";
dotenv.config();
const app = express();

app.use(cors({
  origin: "http://localhost:5173", // ✅ frontend URL where Vite runs
  credentials: true
}));
app.use(express.json());
app.use(morgan("dev"));

// Simple test route
app.get("/api/healthz", (req, res) => res.json({ status: "ok" }));
app.get("/readyz", async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.json({ status: "ready" });
  } catch (err) {
    res.status(500).json({ status: "not-ready", error: err.message });
  }
});
const PORT = process.env.PORT || 4000;

// connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Mongo connected");
    
    app.use("/api/tickets", ticketRoutes);
    app.use("/api/agent", agentRoutes);
    app.use("/api/kb", kbRoutes);
    app.use("/api", auditRoutes);
    app.use("/api/users", userRoutes);
    app.use("/api/config", configRoutes);
    app.use("/api/feedback", feedbackRoutes);
    app.use("/api/notifications", notificationRoutes);
    app.use(requestLogger);




    app.listen(PORT, () => console.log(`🚀 API running on port ${PORT}`));
  })
  .catch(err => console.error("❌ DB Error:", err));
