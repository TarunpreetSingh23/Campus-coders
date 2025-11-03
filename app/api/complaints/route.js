// import { connectDB } from "@/lib/mongodb";
import { connects } from "@/dbconfig/dbconfig";
import Complaint from "@/models/complaintmodel";

// Handle GET requests
export async function GET() {
  await connects();
  const complaints = await Complaint.find({}, "complaint location -_id"); 
  return Response.json({ success: true, complaints });
}

// Handle POST requests
export async function POST(req) {
  await connects();

  const body = await req.json();

  // Validation (optional)
  if (!body.name || !body.email || !body.complaint || !body.location) {
    return Response.json({ success: false, message: "Missing fields" }, { status: 400 });
  }

  const complaint = await Complaint.create(body);
  return Response.json({ success: true, complaint });
}
