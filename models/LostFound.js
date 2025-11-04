// models/LostFound.js
import mongoose from "mongoose";

const LostFoundSchema = new mongoose.Schema({
  name: String,
  email: String,
  type: { type: String, enum: ["Lost", "Found"], required: true },
  itemName: String,
  description: String,
  image: String,
  location: { lat: Number, lng: Number },
  address: String,
  policeStationId: String, // ✅ Reference the verified ID
  policeStationName: String, // For display purposes
  date: { type: Date, default: Date.now },
});

export default mongoose.models.LostFound ||
  mongoose.model("LostFound", LostFoundSchema);
