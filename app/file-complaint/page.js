"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const UserMap = dynamic(() => import("@/components/UseMap"), { ssr: false });

export default function Complaint() {
  const [form, setForm] = useState({ name: "", email: "", complaint: "" });
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [address, setAddress] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchComplaints = async () => {
    const res = await fetch("/api/complaints");
    const data = await res.json();
    if (data.success) setComplaints(data.complaints);
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location.lat) {
      alert("Please choose a location before submitting.");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/complaints", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, location }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) {
      alert("Complaint submitted!");
      setForm({ name: "", email: "", complaint: "" });
      setLocation({ lat: null, lng: null });
      setAddress("");
      fetchComplaints();
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-8 h-screen bg-gradient-to-br from-blue-100 to-indigo-200">
      {/* Form Section */}
      <motion.form
        onSubmit={handleSubmit}
        className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-2xl flex-1 space-y-4 border border-gray-200"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          🧾 Submit a Complaint
        </h1>

        <input
          className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition"
          placeholder="Your Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <input
          className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition"
          placeholder="Your Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <textarea
          className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition"
          placeholder="Describe your complaint"
          rows="3"
          value={form.complaint}
          onChange={(e) => setForm({ ...form, complaint: e.target.value })}
          required
        />

        <button
          type="button"
          onClick={getLocation}
          className="bg-blue-600 hover:bg-blue-700 transition text-white w-full py-2 rounded-xl shadow-md font-semibold"
        >
          📍 Use My Current Location
        </button>

        {address && (
          <p className="text-sm text-gray-700 font-medium">
            Location: <span className="text-blue-700">{address}</span>
          </p>
        )}

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 transition text-white w-full py-2 rounded-xl shadow-md font-semibold"
          disabled={loading}
        >
          {loading ? "Submitting..." : "🚀 Submit Complaint"}
        </button>
      </motion.form>

      {/* Map Section */}
      <motion.div
        className="flex-1 h-[80vh] rounded-3xl overflow-hidden shadow-2xl border border-gray-200"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <UserMap
          complaints={complaints}
          location={location}
          setLocation={setLocation}
          setAddress={setAddress}
        />
      </motion.div>
    </div>
  );
}
