"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";

const MiniMap = dynamic(() => import("@/components/MiniMap"), { ssr: false });

export default function AllComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // Fetch complaints
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

  // Filter user complaints
  useEffect(() => {
    if (userEmail) {
      setFilteredComplaints(
        complaints.filter(
          (c) => c.email && c.email.toLowerCase() === userEmail.toLowerCase()
        )
      );
    }
  }, [userEmail, complaints]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 p-8">
      <motion.h1
        className="text-3xl font-bold text-center mb-6 text-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🧾 My Complaints
      </motion.h1>

      {/* User Email Input */}
      <div className="max-w-md mx-auto mb-8">
        <input
          type="email"
          placeholder="Enter your email to view your complaints"
          className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading complaints...</p>
      ) : userEmail === "" ? (
        <p className="text-center text-gray-500">
          Please enter your email above to see your complaints.
        </p>
      ) : filteredComplaints.length === 0 ? (
        <p className="text-center text-gray-500">No complaints found for this email.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredComplaints.map((c, i) => (
            <motion.div
              key={i}
              className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-lg p-5 border border-gray-200 hover:shadow-2xl transition duration-300 cursor-pointer"
              whileHover={{ scale: 1.03 }}
              onClick={() => setSelectedComplaint(c)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-1">
                {c.type || "Complaint"}
              </h2>
              <p className="text-sm text-gray-600 mb-3">
                <strong>Status:</strong>{" "}
                <span
                  className={`${
                    c.status === "Resolved"
                      ? "text-green-600"
                      : c.status === "In Progress"
                      ? "text-yellow-600"
                      : "text-red-600"
                  } font-semibold`}
                >
                  {c.status || "Pending"}
                </span>
              </p>
              <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                {c.complaint}
              </p>
              {c.address && (
                <p className="text-sm text-blue-700 mb-3 truncate">
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

      {/* Modal for Complaint Details */}
      <AnimatePresence>
        {selectedComplaint && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-2xl relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <button
                onClick={() => setSelectedComplaint(null)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
              >
                ✕
              </button>

              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                {selectedComplaint.type || "Complaint Details"}
              </h2>

              <p className="text-sm text-gray-500 mb-3">
                <strong>Name:</strong> {selectedComplaint.name || "Anonymous"}
              </p>
              <p className="text-sm text-gray-500 mb-3">
                <strong>Email:</strong> {selectedComplaint.email}
              </p>
              <p className="text-gray-700 mb-4">
                <strong>Complaint:</strong> {selectedComplaint.complaint}
              </p>
              <p className="text-gray-700 mb-4">
                <strong>Status:</strong>{" "}
                <span
                  className={`${
                    selectedComplaint.status === "Resolved"
                      ? "text-green-600"
                      : selectedComplaint.status === "In Progress"
                      ? "text-yellow-600"
                      : "text-red-600"
                  } font-semibold`}
                >
                  {selectedComplaint.status || "Pending"}
                </span>
              </p>

              {selectedComplaint.address && (
                <p className="text-blue-700 mb-4">
                  📍 {selectedComplaint.address}
                </p>
              )}

              {selectedComplaint.location?.lat && (
                <div className="h-64 rounded-xl overflow-hidden">
                  <MiniMap
                    lat={selectedComplaint.location.lat}
                    lng={selectedComplaint.location.lng}
                  />
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
