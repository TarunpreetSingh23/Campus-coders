import { NextResponse } from "next/server";
import mongoose from "mongoose";
import LostFound from "@/models/LostFound";
import { connects } from "@/dbconfig/dbconfig";

const MONGO_URI = process.env.MONGODB_URI;

// async function connect() {
//   if (mongoose.connection.readyState >= 1) return;
//   await mongoose.connect(MONGO_URI);
// }

export async function GET() {
  await connects();
  const items = await LostFound.find().sort({ date: -1 });
  return NextResponse.json({ success: true, items });
}

export async function POST(req) {
  await connects();
  const data = await req.json();
  const newItem = await LostFound.create(data);
  return NextResponse.json({ success: true, item: newItem });
}
