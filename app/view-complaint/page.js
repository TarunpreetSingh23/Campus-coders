"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const MiniMap = dynamic(() => import("@/components/MiniMap"), { ssr: false });

export default function AllComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await fetch("/api/complaints");
        const data = await res.json();
        if (data.success) {
          setComplaints(data.complaints);
        }
      } catch (err) {
        console.error("Error fetching complaints:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 p-8">
      <motion.h1
        className="text-3xl font-bold text-center mb-8 text-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🧾 All Submitted Complaints
      </motion.h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading complaints...</p>
      ) : complaints.length === 0 ? (
        <p className="text-center text-gray-500">No complaints yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {complaints.map((c, i) => (
            <motion.div
              key={i}
              className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-lg p-5 border border-gray-200 hover:shadow-2xl transition duration-300"
              whileHover={{ scale: 1.03 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-1">
                {c.name || "Anonymous"}
              </h2>
              <p className="text-sm text-gray-500 mb-3">{c.email}</p>
              <p className="text-gray-700 text-sm mb-3">
                <strong>Complaint:</strong> {c.complaint}
              </p>

              {c.address && (
                <p className="text-sm text-blue-700 mb-3">
                  📍 {c.address}
                </p>
              )}

              {c.location?.lat && (
                <div className="h-40 rounded-xl overflow-hidden">
                  <MiniMap lat={c.location.lat} lng={c.location.lng} />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
