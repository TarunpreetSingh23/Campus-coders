import mongoose from "mongoose";

const NgoSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    contribution: { type: String, required: true },
    details: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Ngo || mongoose.model("Ngo", NgoSchema);
