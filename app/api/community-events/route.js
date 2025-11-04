import { NextResponse } from "next/server";
// import CommunityEvents from "@/app/community-events/page";
import { connects } from "@/dbconfig/dbconfig";
import CommunityEvents from "@/models/CommunityEvents";

export async function GET(req) {
  await connects();
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city");

  const query = city ? { city: { $regex: city, $options: "i" } } : {};
  const events = await CommunityEvents.find(query).sort({ date: 1 });
  return NextResponse.json({ success: true, events });
}
