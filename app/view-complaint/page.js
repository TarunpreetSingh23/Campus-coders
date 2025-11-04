"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";

const MiniMap = dynamic(() => import("@/components/MiniMap"), { ssr: false });

export default function AllComplaints() {
  const { data: session, status } = useSession();
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [updating, setUpdating] = useState(false);

  // Fetch complaints
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await fetch("/api/complaints");
        const data = await res.json();
        if (data.success) setComplaints(data.complaints);
      } catch (err) {
        console.error("Error fetching complaints:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  // Auto-filter by logged-in user
  useEffect(() => {
    if (session?.user?.email) {
      setFilteredComplaints(
        complaints.filter(
          (c) => c.email?.toLowerCase() === session.user.email.toLowerCase()
        )
      );
    }
  }, [session, complaints]);

  const handleMarkAsSolved = async (id) => {
    try {
      setUpdating(true);
      const res = await fetch(`/api/resolve-complaints/${id}/resolve`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (data.success) {
        // Update UI immediately
        setFilteredComplaints((prev) =>
          prev.map((c) =>
            c.order_id === id ? { ...c, status: "Resolved" } : c
          )
        );
        setSelectedComplaint((prev) => ({
          ...prev,
          status: "Resolved",
        }));
      }
    } catch (err) {
      console.error("Failed to mark as solved:", err);
    } finally {
      setUpdating(false);
    }
  };

  if (status === "loading" || loading)
    return (
      <p className="text-center text-gray-400 mt-10">Loading complaints...</p>
    );

  if (!session?.user?.email)
    return (
      <p className="text-center text-gray-400 mt-10">
        Please sign in to view your complaints.
      </p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-100 p-8 pt-[110px]">
      <motion.h1
        className="text-4xl font-bold text-center mb-10 text-[#3ab4ff]"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🧾 My Complaints
      </motion.h1>

      {filteredComplaints.length === 0 ? (
        <p className="text-center text-gray-500">
          No complaints found for {session.user.email}.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredComplaints.map((c, i) => (
            <motion.div
              key={i}
              className="bg-gray-900/60 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-gray-800 hover:border-[#3ab4ff]/40 hover:shadow-[#3ab4ff]/20 transition duration-300 cursor-pointer"
              whileHover={{ scale: 1.03 }}
              onClick={() => setSelectedComplaint(c)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold text-white">
                  {c.type || "Complaint"}
                </h2>
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    c.status === "Resolved"
                      ? "bg-green-500/20 text-green-400"
                      : c.status === "In Progress"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {c.status || "Pending"}
                </span>
              </div>

              <p className="text-sm text-gray-400">
                <strong>Order:</strong> {c.order_id || "N/A"}
              </p>
              <p className="text-sm text-gray-400 mb-2">
                <strong>Dept:</strong> {c.department || "N/A"}
              </p>
              <p className="text-sm text-gray-500 mb-3">
                {new Date(c.createdAt).toLocaleDateString()}
              </p>

              <p className="text-gray-300 text-sm mb-3 line-clamp-3">
                {c.complaint || c.Task || "No details provided."}
              </p>

              {c.address && (
                <p className="text-xs text-[#3ab4ff] mb-2 truncate">
                  📍 {c.address}
                </p>
              )}

              {c.assignedWorkers?.length > 0 && (
                <div className="text-xs text-gray-400 mt-2">
                  <p className="font-semibold mb-1">👷 Assigned Workers:</p>
                  <ul className="space-y-1 max-h-20 overflow-auto">
                    {c.assignedWorkers.map((w, idx) => (
                      <li key={idx} className="flex justify-between">
                        <span>{w.workerId}</span>
                        <span
                          className={`capitalize ${
                            w.status === "accepted"
                              ? "text-green-400"
                              : w.status === "rejected"
                              ? "text-red-400"
                              : "text-yellow-400"
                          }`}
                        >
                          {w.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {c.location?.lat && (
                <div className="h-36 rounded-xl overflow-hidden mt-4">
                  <MiniMap lat={c.location.lat} lng={c.location.lng} />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal for details */}
      <AnimatePresence>
        {selectedComplaint && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-900/90 backdrop-blur-lg border border-gray-700 rounded-3xl shadow-2xl p-6 w-full max-w-2xl relative overflow-y-auto max-h-[90vh]"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <button
                onClick={() => setSelectedComplaint(null)}
                className="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl font-bold"
              >
                ✕
              </button>

              <h2 className="text-2xl font-bold text-[#3ab4ff] mb-4">
                {selectedComplaint.type || "Complaint Details"}
              </h2>

              <div className="space-y-2 text-sm text-gray-300">
                <p><strong>Order ID:</strong> {selectedComplaint.order_id}</p>
                <p><strong>Department:</strong> {selectedComplaint.department}</p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`font-semibold ${
                      selectedComplaint.status === "Resolved"
                        ? "text-green-400"
                        : selectedComplaint.status === "In Progress"
                        ? "text-yellow-400"
                        : "text-red-400"
                    }`}
                  >
                    {selectedComplaint.status}
                  </span>
                </p>
                <p>
                  <strong>Complaint:</strong>{" "}
                  {selectedComplaint.complaint || selectedComplaint.Task}
                </p>
                {selectedComplaint.address && (
                  <p className="text-[#3ab4ff]">📍 {selectedComplaint.address}</p>
                )}
              </div>

              {selectedComplaint.status !== "Resolved" && (
                <button
                  onClick={() => handleMarkAsSolved(selectedComplaint._id)}
                  disabled={updating}
                  className="mt-5 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 rounded-xl shadow-md transition disabled:opacity-50"
                >
                  {updating ? "Updating..." : "✅ Mark as Solved"}
                </button>
              )}

              {selectedComplaint.location?.lat && (
                <div className="h-64 rounded-xl overflow-hidden mt-4">
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
