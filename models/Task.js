import mongoose from "mongoose";
import Worker from "@/models/Worker"; 

const TaskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  Task: { type: String },

  order_id: { type: String, unique: true },

  type: {
    type: String,
    enum: ["Road", "Water", "Electricity", "Waste", "Stray-Dog", "Other"],
    default: "Other",
  },

  status: {
    type: String,
    enum: ["Pending", "In Progress", "Resolved"],
    default: "Pending",
  },

  department: {
    type: String,
    default: null,
  },

  assignedWorkers: [
    {
      workerId: { type: String, required: true },
      status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
      },
    },
  ],

  location: {
    lat: Number,
    lng: Number,
  },

  address: String,
  createdAt: { type: Date, default: Date.now },
});


TaskSchema.pre("save", async function (next) {
  if (!this.order_id) {
    let prefix = "OR"; // default

    switch (this.type?.toLowerCase()) {
      case "electricity":
        prefix = "EC";
        this.department = "Electricity Board";
        break;
      case "road":
        prefix = "RD";
        this.department = "PWD Department";
        break;
      case "water":
        prefix = "WT";
        this.department = "Water Supply Dept";
        break;
      case "waste":
        prefix = "WS";
        break;
      case "stray-dog":
        prefix = "SD";
        break;
      default:
        prefix = "OT";
        this.department = "General Department";
        break;
    }

    // Generate order ID
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    this.order_id = `${prefix}${randomDigits}`;

    // 🔥 Auto-assign workers whose IDs start with same prefix
    try {
      const workers = await Worker.find({ workerId: new RegExp(`^${prefix}`) });

      if (workers.length > 0) {
        this.assignedWorkers = workers.map((w) => ({
          workerId: w.workerId,
          status: "pending",
        }));
      }

      // If Waste or Stray-Dog → Assign to NGO based on city name
      if (["waste", "stray-dog"].includes(this.type.toLowerCase())) {
        const cityMatch =
          this.address?.match(/([A-Za-z\s]+),\s*Punjab/i)?.[1]?.trim() ||
          "Unknown";
        this.department = `NGO${cityMatch.replace(/\s+/g, "")}`;
      }
    } catch (err) {
      console.error("Error auto-assigning workers:", err);
    }
  }

  next();
});

export default mongoose.models.Task ||
  mongoose.model("Task", TaskSchema);
