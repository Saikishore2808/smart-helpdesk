import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  status: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  aiFeedback: { type: String, enum: ["up", "down"], default: null }, // <-- Add this
}, { timestamps: true });

export default mongoose.model("Ticket", ticketSchema);
