import { NextResponse } from "next/server";
import PoliceStation from "@/models/PoliceStation";
import { connects } from "@/dbconfig/dbconfig";

export async function GET(req) {
  await connects();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ success: false, message: "ID required" });
  }

  const station = await PoliceStation.findOne({ stationId: id });
  if (!station) {
    return NextResponse.json({ success: false, message: "Invalid ID" });
  }

  return NextResponse.json({ success: true, station });
}
