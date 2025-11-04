import { NextResponse } from "next/server";
import LostFound from "@/models/LostFound";
import PoliceStation from "@/models/PoliceStation"; // ✅ Import police station model
import { connects } from "@/dbconfig/dbconfig";

export async function GET(req) {
  try {
    await connects();

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const city = searchParams.get("city");

    const query = {};
    if (type) query.type = type;
    if (city) query.address = { $regex: city, $options: "i" };

    const items = await LostFound.find(query).sort({ date: -1 });
    return NextResponse.json({ success: true, items });
  } catch (err) {
    console.error("GET Error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connects();
    const data = await req.json();

    // ✅ Verify that policeStationId exists if the report type is "Found"
    if (data.type === "Found") {
      if (!data.policeStationId) {
        return NextResponse.json(
          { success: false, message: "Police station ID is required." },
          { status: 400 }
        );
      }

      // ✅ Check if the police station ID exists in the DB
      const validStation = await PoliceStation.findOne({
        stationId: data.policeStationId,
        verified: true,
      });

      if (!validStation) {
        return NextResponse.json(
          { success: false, message: "Invalid or unverified police station ID." },
          { status: 403 }
        );
      }
    }

    // ✅ Create Lost/Found record
    const newItem = await LostFound.create({
      name: data.name,
      email: data.email,
      type: data.type,
      itemName: data.itemName,
      description: data.description,
      image: data.image || "",
      location: data.location || {},
      address: data.address || "",
      policeStationId: data.policeStationId || "", // store stationId
    });

    return NextResponse.json({ success: true, item: newItem });
  } catch (err) {
    console.error("POST Error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
