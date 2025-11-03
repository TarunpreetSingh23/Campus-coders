// /app/api/complaints/route.js
import { NextResponse } from "next/server";
import { connects } from "@/dbconfig/dbconfig";
import Complaint from "@/models/complaintmodel";

export async function GET() {
  await connects();
  const complaints = await Complaint.find({ status: "Solved" })
    .sort({ updatedAt: -1 })
    .limit(10);
  return NextResponse.json(complaints);
}
