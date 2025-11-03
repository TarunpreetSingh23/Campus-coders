import { NextResponse } from "next/server";
// import connectDB from "@/lib/mongodb";
import { connects } from "@/dbconfig/dbconfig";
import Complaint from "@/models/complaintmodel";

export async function GET() {
  await connects();
  const complaints = await Complaint.find().sort({ createdAt: -1 });
  return NextResponse.json({ success: true, complaints });
}

export async function POST(req) {
  await connects();
  const data = await req.json();
  const newComplaint = await Complaint.create(data);
  return NextResponse.json({ success: true, complaint: newComplaint });
}

// For updating status or department
export async function PATCH(req) {
  await connects();
  const { id, status, department } = await req.json();

  if (!id) return NextResponse.json({ success: false, message: "Missing ID" });

  const updated = await Complaint.findByIdAndUpdate(
    id,
    { status, department },
    { new: true }
  );

  return NextResponse.json({ success: true, complaint: updated });
}
