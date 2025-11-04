import { NextResponse } from "next/server";
// import connectDB from "@/lib/mongodb";
import { connects } from "@/dbconfig/dbconfig";
import Task from "@/models/Task";

export async function GET() {
  await connects();
  const complaints = await Task.find().sort({ createdAt: -1 });
  console.log(complaints)
  return NextResponse.json({ success: true, complaints });
}

export async function POST(req) {
  await connects();
  const data = await req.json();
  const newComplaint = await Task.create(data);
  return NextResponse.json({ success: true, complaint: newComplaint });
}

// For updating status or department
export async function PATCH(req) {
  await connects();
  const { id, status, department } = await req.json();

  if (!id) return NextResponse.json({ success: false, message: "Missing ID" });

  const updated = await Task.findByIdAndUpdate(
    id,
    { status, department },
    { new: true }
  );

  return NextResponse.json({ success: true, complaint: updated });
}