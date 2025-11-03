"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// ✅ Make sure file name is UserMap.jsx
const UserMap = dynamic(() => import("@/components/UseMap"), { ssr: false });

export default function MapPage() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await fetch("/api/complaints");
        const data = await res.json();
        console.log("Fetched complaints:", data);
        if (data.success) {
          setComplaints(data.complaints);
        }
      } catch (err) {
        console.error("Error fetching complaints:", err);
      }
    };
    fetchComplaints();
  }, []);

  return (
    <div className="p-6 h-screen">
      <h1 className="text-2xl font-bold mb-4">Complaint Locations</h1>
      <div className="h-[80vh] w-full">
        <UserMap complaints={complaints} />
      </div>
    </div>
  );
}
