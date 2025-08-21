import mongoose from "mongoose";

const agentSuggestionSchema = new mongoose.Schema(
  {
    ticketId: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket", required: true },
    predictedCategory: { type: String },
    articleIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Article" }],
    draftReply: { type: String },
    confidence: { type: Number },
    autoClosed: { type: Boolean, default: false },
    modelInfo: {
      provider: { type: String, default: "stub" },
      version: { type: String, default: "v1" },
      latencyMs: { type: Number }
    }
  },
  { timestamps: true }
);

export default mongoose.model("AgentSuggestion", agentSuggestionSchema);
