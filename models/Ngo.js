import mongoose from "mongoose";

const NgoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, // e.g. Environment, Education, Health, etc.
  description: String,
  mission: String,
  contactEmail: String,
  phone: String,
  address: String,
  website: String,
  logo: String, // base64 or image URL
  location: {
    lat: Number,
    lng: Number,
  },
});

export default mongoose.models.Ngo || mongoose.model("Ngo", NgoSchema);
