"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const UserMap = dynamic(() => import("@/components/UseMap"), { ssr: false });

export default function LostFound() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    itemName: "",
    description: "",
    type: "", // "Lost" or "Found"
    image: "",
  });
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [address, setAddress] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all lost/found items
  const fetchItems = async () => {
    try {
      const res = await fetch("/api/lostfound");
      const data = await res.json();
      if (data.success) setItems(data.items);
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Get current location
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

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, image: reader.result }); // Base64
    };
    reader.readAsDataURL(file);
  };

  // Submit lost/found item
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.type) {
      alert("Please select Lost or Found.");
      return;
    }
    if (!location.lat) {
      alert("Please select your location.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/lostfound", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, location, address }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      alert("Item successfully submitted!");
      setForm({
        name: "",
        email: "",
        itemName: "",
        description: "",
        type: "",
        image: "",
      });
      setLocation({ lat: null, lng: null });
      setAddress("");
      fetchItems();
    } else {
      alert("Error submitting item.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 p-8 min-h-screen bg-gradient-to-br from-yellow-50 via-orange-100 to-pink-100">
      {/* Left: Lost & Found Form */}
      <motion.form
        onSubmit={handleSubmit}
        className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl flex-1 space-y-5 border border-gray-200"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
          🧳 Lost & Found Submission
        </h1>

        <div className="space-y-3">
          <input
            className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none transition"
            placeholder="Your Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <input
            className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none transition"
            placeholder="Your Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <select
            className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none transition bg-white"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            required
          >
            <option value="">Select Type</option>
            <option value="Lost">❌ Lost Item</option>
            <option value="Found">✅ Found Item</option>
          </select>

          <input
            className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none transition"
            placeholder="Item Name"
            value={form.itemName}
            onChange={(e) => setForm({ ...form, itemName: e.target.value })}
            required
          />

          <textarea
            className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none transition"
            placeholder="Describe the item"
            rows="3"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full border p-3 rounded-xl bg-white"
          />

          {form.image && (
            <img
              src={form.image}
              alt="preview"
              className="rounded-xl w-32 h-32 object-cover mt-2 border"
            />
          )}
        </div>

        <motion.button
          type="button"
          onClick={getLocation}
          className="bg-blue-600 hover:bg-blue-700 transition text-white w-full py-3 rounded-xl shadow-md font-semibold"
          whileTap={{ scale: 0.97 }}
        >
          📍 Use My Current Location
        </motion.button>

        {address && (
          <p className="text-sm text-gray-700 font-medium mt-2">
            Location: <span className="text-orange-700">{address}</span>
          </p>
        )}

        <motion.button
          type="submit"
          className="bg-green-600 hover:bg-green-700 transition text-white w-full py-3 rounded-xl shadow-md font-semibold mt-3"
          disabled={loading}
          whileTap={{ scale: 0.97 }}
        >
          {loading ? "Submitting..." : "🚀 Submit Item"}
        </motion.button>
      </motion.form>

      {/* Right: Map + Items */}
      <motion.div
        className="flex-1 h-[80vh] rounded-3xl overflow-hidden shadow-2xl border border-gray-200"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <UserMap
          complaints={items} // reuse same map
          location={location}
          setLocation={setLocation}
          setAddress={setAddress}
        />
      </motion.div>
    </div>
  );
}
