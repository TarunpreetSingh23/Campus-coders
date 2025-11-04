import mongoose from "mongoose";

const PoliceStationSchema = new mongoose.Schema({
  stationId: {
    type: String,
    required: true,
    unique: true, // e.g., "PS-DEL-001"
  },
  name: {
    type: String,
    required: true, // e.g., "Connaught Place Police Station"
  },
  district: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
  },
  email: {
    type: String,
  },
  verified: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.PoliceStation ||
  mongoose.model("PoliceStation", PoliceStationSchema);
