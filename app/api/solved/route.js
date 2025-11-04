// /app/api/complaints/route.js
import { NextResponse } from "next/server";
import { connects } from "@/dbconfig/dbconfig";
import Task from "@/models/Task";

export async function GET() {
  await connects();
  const complaints = await Task.find({ status: "Solved" })
    .sort({ updatedAt: -1 })
    .limit(10);
  return NextResponse.json(complaints);
}
