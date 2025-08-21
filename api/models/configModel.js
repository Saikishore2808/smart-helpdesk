import mongoose from "mongoose";

const configSchema = new mongoose.Schema({
  autoCloseEnabled: { type: Boolean, default: true },
  confidenceThreshold: { type: Number, default: 0.75 }
});

export default mongoose.model("Config", configSchema);
