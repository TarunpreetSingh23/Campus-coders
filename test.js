import mongoose from "mongoose";
import dotenv from "dotenv";
import Event from "./models/CommunityEvent.js";

dotenv.config();

const data = [
  {
    title: "Delhi Green Walk & Clean-Up Drive",
    description:
      "Join local volunteers to clean up Lodhi Garden and learn about urban waste management and recycling practices.",
    date: "2025-11-10",
    venue: "Lodhi Garden, Delhi",
    city: "Delhi",
    organizer: "Delhi Eco Volunteers",
    image: "https://images.unsplash.com/photo-1599245822912-b39f9ef13d1d",
  },
  {
    title: "Mumbai Coastal Tree Plantation Drive",
    description:
      "An initiative to restore the mangrove belt near Versova Beach and raise awareness about marine biodiversity.",
    date: "2025-11-15",
    venue: "Versova Beach, Mumbai",
    city: "Mumbai",
    organizer: "Green Earth NGO",
    image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6",
  },
  // ... (add others from above)
];

async function seedDB() {
  await mongoose.connect(process.env.MONGO_URI);
  await Event.deleteMany({});
  await Event.insertMany(data);
  console.log("🌱 Dummy community events inserted successfully!");
  mongoose.connection.close();
}

seedDB();
