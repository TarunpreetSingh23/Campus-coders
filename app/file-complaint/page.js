"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const UserMap = dynamic(() => import("@/components/UseMap"), { ssr: false });

// --- Theme Colors ---
const PRIMARY_COLOR = "bg-[#2856c2] hover:bg-[#3a6aff]";
const ACCENT_COLOR = "text-[#3ab4ff]";
const BACKGROUND_COLOR = "bg-gray-700";
const CARD_COLOR = "bg-gray-900/70 backdrop-blur-md border border-gray-700/40";
const SHADOW_STYLE = "shadow-xl shadow-black/40";

export default function ComplaintPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    complaint: "",
    type: "",
  });
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [address, setAddress] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState("");
  const [assignedNGO, setAssignedNGO] = useState(null);

  // Fetch complaints
  const fetchComplaints = async () => {
    try {
      const res = await fetch("/api/complaints");
      const data = await res.json();
      if (data.success) setComplaints(data.complaints);
    } catch (err) {
      console.error("Error fetching complaints:", err);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Get geolocation
  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setLocation({ lat, lng });

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
          );
          const data = await res.json();
          setAddress(data.display_name || "Unknown location");
        } catch {
          setAddress("Unable to fetch address");
        }
      },
      (err) => alert("Location error: " + err.message)
    );
  };

  // Submit complaint
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.type) return alert("Please select a complaint type.");
    if (!form.phone) return alert("Phone number is required.");
    if (!location.lat) return alert("Please allow or pick your location.");

    setLoading(true);
    const res = await fetch("/api/complaints", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        location,
        address,
        status: "Pending",
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      setNotification("✅ Complaint submitted successfully!");
      setAssignedNGO(data.data?.assignedNGO || null);
      setForm({ name: "", email: "", phone: "", complaint: "", type: "" });
      setLocation({ lat: null, lng: null });
      setAddress("");
      fetchComplaints();
    } else {
      setNotification("❌ Error submitting complaint.");
    }
  };

  return (
   <div
  className={`${BACKGROUND_COLOR} min-h-screen text-gray-100 px-6 sm:px-10 pt-[110px] pb-10`}
>

      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-6 right-6 mt-[70px] bg-blue-300 text-white px-6 py-4 rounded-xl border-l-4 border-[#3ab4ff] shadow-lg flex items-center justify-between w-[350px] z-50"
        >
          <span>{notification}</span>
          <button
            onClick={() => setNotification("")}
            className="ml-3 text-gray-400 hover:text-white"
          >
            ✖
          </button>
        </motion.div>
      )}

      {/* Header */}
      <motion.header
        className="max-w-6xl mx-auto mb-10 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3">
          Community <span className={ACCENT_COLOR}>Complaint Portal</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Report issues in your community with live location tracking for faster action and accountability.
        </p>
        <div className="h-1 w-24 bg-gradient-to-r from-[#3ab4ff] to-[#2856c2] mx-auto mt-5 rounded-full" />
      </motion.header>

      {/* Main Layout */}
      <div className="flex flex-col md:flex-row max-w-6xl mx-auto gap-10">
        {/* Complaint Form */}
        <motion.form
          onSubmit={handleSubmit}
          className={`${CARD_COLOR} p-8 rounded-2xl ${SHADOW_STYLE} flex-1 space-y-6 h-fit`}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-white border-b border-gray-700 pb-3 mb-4">
            📝 Submit a Complaint
          </h2>

          <div className="space-y-4">
            <input
              className="w-full bg-gray-800/60 text-white border border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-[#3ab4ff] outline-none placeholder-gray-400"
              placeholder="Your Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />

            <input
              className="w-full bg-gray-800/60 text-white border border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-[#3ab4ff] outline-none placeholder-gray-400"
              placeholder="Email Address"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />

            <input
              className="w-full bg-gray-800/60 text-white border border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-[#3ab4ff] outline-none placeholder-gray-400"
              placeholder="Phone Number"
              type="text"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />

            <select
              className="w-full bg-gray-800/60 text-white border border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-[#3ab4ff] outline-none"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              required
            >
              <option value="">Select Complaint Type</option>
              <option value="Road">🚧 Road Issue</option>
              <option value="Water">💧 Water Supply</option>
              <option value="Electricity">⚡ Electricity</option>
              <option value="Waste">🗑️ Waste Management</option>
            </select>

            <textarea
              className="w-full bg-gray-800/60 text-white border border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-[#3ab4ff] outline-none resize-none placeholder-gray-400"
              placeholder="Describe the issue in detail"
              rows="4"
              value={form.complaint}
              onChange={(e) => setForm({ ...form, complaint: e.target.value })}
              required
            />

            <button
              type="button"
              onClick={getLocation}
              className="flex items-center justify-center bg-[#3ab4ff] hover:bg-[#2856c2] text-white w-full py-3 rounded-lg shadow-md font-semibold text-lg transition-all"
            >
              🛰 Get My Current Location
            </button>

            {address && (
              <div className="p-3 bg-[#3ab4ff]/10 border border-[#3ab4ff]/50 rounded-lg text-sm text-gray-100">
                <p className="font-semibold text-[#3ab4ff]">📍 Location:</p>
                <p>{address}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Coordinates: {location.lat?.toFixed(4)}, {location.lng?.toFixed(4)}
                </p>
              </div>
            )}

            {assignedNGO && (
              <div className="p-3 bg-[#2856c2]/20 border border-[#3ab4ff]/40 rounded-lg text-sm">
                <p className="font-semibold text-[#3ab4ff]">Assigned NGO:</p>
                <p>{assignedNGO}</p>
              </div>
            )}
          </div>

          <button
            type="submit"
            className={`${PRIMARY_COLOR} text-white w-full py-3 rounded-lg shadow-xl font-extrabold text-lg tracking-wide transition-all ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Submitting..." : "🚀 Submit Complaint"}
          </button>
        </motion.form>

        {/* Map Section */}
        <motion.div
          className="flex-1 min-h-[500px] rounded-2xl overflow-hidden shadow-2xl border-4 border-[#3ab4ff]/50"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <UserMap
            complaints={complaints}
            location={location}
            setLocation={setLocation}
            setAddress={setAddress}
          />
        </motion.div>
      </div>
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-400 rounded-full blur-3xl opacity-20 animate-pulse" />
    </div>
  );
}
