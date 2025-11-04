import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  venue: String,
  city: String,
  organizer: String,
  image: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.CommunityEvent ||
  mongoose.model("CommunityEvent", EventSchema);
