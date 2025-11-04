// import connectDB from "@/lib/mongodb";
import { connects } from "@/dbconfig/dbconfig";
import Ngo from "@/models/Ngo";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connects();

    let ngos = await Ngo.find();

    // If no data in DB, insert dummy NGOs
    if (ngos.length === 0) {
      const dummyData = [
        {
          name: "Helping Hands Foundation",
          contribution: "Distributed 10,000 food packets during flood relief.",
          details:
            "Helping Hands Foundation is a non-profit focused on humanitarian relief. They have supported 100,000+ people.",
        },
        {
          name: "Green Earth Initiative",
          contribution: "Planted 5,000 trees in the last two months.",
          details:
            "Green Earth Initiative promotes reforestation and awareness through community-driven campaigns.",
        },
        {
          name: "Smile For All",
          contribution: "Provided free education kits to 3,000 children.",
          details:
            "Smile For All focuses on child education and welfare through literacy programs in underprivileged areas.",
        },
      ];

      ngos = await Ngo.insertMany(dummyData);
    }

    return NextResponse.json({ success: true, ngos });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Error fetching NGOs" },
      { status: 500 }
    );
  }
}
