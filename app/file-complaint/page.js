"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const UserMap = dynamic(() => import("@/components/UseMap"), { ssr: false });

const PRIMARY_COLOR = "bg-emerald-600 hover:bg-emerald-700";
const ACCENT_COLOR = "text-emerald-400";
const BACKGROUND_COLOR = "bg-gray-900";
const CARD_COLOR = "bg-gray-800";
const SHADOW_STYLE = "shadow-2xl shadow-black/50";

export default function ComplaintPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    complaint: "",
    type: "",
  });
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [address, setAddress] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState("");

  // Fetch complaints from MongoDB
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

  // Get current geolocation
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.type) {
      alert("Please select a complaint type.");
      return;
    }
    if (!location.lat) {
      alert("Please select or allow location.");
      return;
    }

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
      setForm({ name: "", email: "", complaint: "", type: "" });
      setLocation({ lat: null, lng: null });
      setAddress("");
      fetchComplaints();
    } else {
      setNotification("❌ Error submitting complaint.");
    }
  };

  return (
    <div className={`${BACKGROUND_COLOR} min-h-screen text-gray-100 p-8`}>
      {notification && (
        <div className="fixed top-6 right-6 bg-gray-800 text-white px-5 py-3 rounded-xl shadow-lg border-l-4 border-[#0070f3]">
          {notification}
          <button
            onClick={() => setNotification("")}
            className="ml-4 text-gray-400 hover:text-white"
          >
            ✖
          </button>
        </div>
      )}

      <motion.header
        className="max-w-6xl mx-auto mb-10 pb-4 border-b-4 border-[#0070f3]"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-extrabold text-white">
          Community <span className={ACCENT_COLOR}>Complaint Portal</span>
        </h1>
        <p className="text-lg text-gray-400 mt-2 font-light">
          Submit your issues with accurate location data for faster resolutions.
        </p>
      </motion.header>

      <div className="flex flex-col md:flex-row max-w-6xl mx-auto gap-8">
        {/* Complaint Form */}
        <motion.form
          onSubmit={handleSubmit}
          className={`${CARD_COLOR} p-8 rounded-2xl ${SHADOW_STYLE} flex-1 space-y-6 h-fit border border-gray-700/50`}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-white border-b border-gray-700 pb-3 mb-4">
            Submit a Complaint
          </h2>

          <input
            className="w-full bg-gray-700 text-white border border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-[[#0070f3]] outline-none placeholder-gray-400"
            placeholder="Your Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <input
            className="w-full bg-gray-700 text-white border border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-[[#0070f3]] outline-none placeholder-gray-400"
            placeholder="Email Address"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <select
            className="w-full bg-gray-700 text-white border border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-[[#0070f3]] outline-none"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            required
          >
            <option value="">Select Complaint Type</option>
            <option value="Road">🚧 Road Issue</option>
            <option value="Water">💧 Water Supply</option>
            <option value="Electricity">⚡ Electricity</option>
            <option value="Waste">🗑️ Waste Management</option>
            <option value="Other">📋 Other</option>
          </select>

          <textarea
            className="w-full bg-gray-700 text-white border border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-[[#0070f3]] outline-none resize-none placeholder-gray-400"
            placeholder="Describe the issue in detail"
            rows="4"
            value={form.complaint}
            onChange={(e) => setForm({ ...form, complaint: e.target.value })}
            required
          />

          <button
            type="button"
            onClick={getLocation}
            className="flex items-center justify-center bg-blue-700 hover:bg-blue-800 text-white w-full py-3 rounded-lg shadow-md font-semibold text-lg"
          >
            🛰 Use My Current Location
          </button>

          {address && (
            <div className="p-3 bg-emerald-900/40 border border-[#0070f3] rounded-lg text-sm text-gray-100">
              <p className="font-bold text-[#0070f3]">Location:</p>
              <p>{address}</p>
              <p className="text-xs text-gray-400 mt-1">
                Coordinates: {location.lat?.toFixed(4)},{" "}
                {location.lng?.toFixed(4)}
              </p>
            </div>
          )}

          <button
            type="submit"
            className={`${PRIMARY_COLOR} text-white w-full py-3 rounded-lg shadow-xl font-extrabold text-lg tracking-wider ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Submitting..." : "🚀 Submit Complaint"}
          </button>
        </motion.form>

        {/* Map Section */}
        <motion.div
          className="flex-1 min-h-[500px] rounded-2xl overflow-hidden shadow-2xl border-4 border-[[#0070f3]]/70"
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
    </div>
  );
}
