import mongoose from "mongoose";

const connects = async () => {
  if (mongoose.connections[0].readyState) return;

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(" MongoDB connected");
  } catch (error) {
    console.error(" MongoDB connection error:", error);
    throw new Error("MongoDB connection failed");
  }
};

export { connects };