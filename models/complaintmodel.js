import mongoose from "mongoose";

const ComplaintSchema = new mongoose.Schema({
  name: String,
  email: String,
  complaint: String,
  type: {
    type: String,
    enum: ["Road", "Water", "Electricity", "Waste", "Other"], // you can add more
    default: "Other",
  },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Resolved"],
    default: "Pending",
  },
  department: {
    type: String,
    default: null, // optional field for assigned department
  },
  location: {
    lat: Number,
    lng: Number,
  },
  address: String, // optional - you already use this on frontend
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Complaint =
  mongoose.models.Complaint || mongoose.model("Complaint", ComplaintSchema);

export default Complaint;
