import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Ngo from "@/models/Ngo";
import { connects } from "@/dbconfig/dbconfig";

// const MONGO_URI = process.env.MONGODB_URI;

// async function connectDB() {
//   if (mongoose.connection.readyState >= 1) return;
//   await mongoose.connect(MONGO_URI);
// }

export async function GET() {
  await connects();
  const ngos = await Ngo.find().sort({ name: 1 });
  return NextResponse.json({ success: true, ngos });
}

export async function POST(req) {
  await connects();
  const data = await req.json();
  const ngo = await Ngo.create(data);
  return NextResponse.json({ success: true, ngo });
}
