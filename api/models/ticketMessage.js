import mongoose from "mongoose";

const ticketMessageSchema = new mongoose.Schema(
  {
    ticketId: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket", required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    role: { type: String, enum: ["user", "agent"], required: true }
  },
  { timestamps: true }
);

export default mongoose.model("TicketMessage", ticketMessageSchema);
