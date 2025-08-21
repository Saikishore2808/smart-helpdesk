// api/seed.js
import mongoose from "mongoose";
import dotenv from "dotenv";

import User from "./models/User.js";
import Ticket from "./models/Ticket.js";
import KB from "./models/KBArticle.js";

dotenv.config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Mongo connected");

    console.log("🧹 Clearing old data...");
    await mongoose.connection.db.dropDatabase();

    console.log("👤 Creating users...");
    const admin = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "123456",   // plain password (will be hashed by pre-save hook)
      role: "admin"
    });

    const agent = await User.create({
      name: "Agent User",
      email: "agent@example.com",
      password: "123456",   // plain password
      role: "agent"
    });

    const user = await User.create({
      name: "Normal User",
      email: "user@example.com",
      password: "123456",   // plain password
      role: "user"
    });

    console.log("📚 Creating KB article...");
    await KB.create({
      title: "Password Reset",
      body: "Steps to reset your password...",
      category: "account"
    });

    console.log("🎫 Creating ticket...");
    await Ticket.create({
      title: "Login issue",
      description: "I cannot login to my account",
      category: "account",
      createdBy: user._id
    });

    console.log("✅ Seed completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  }
}

seed();
