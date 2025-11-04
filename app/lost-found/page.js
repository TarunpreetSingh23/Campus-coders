"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";

const UserMap = dynamic(() => import("@/components/UseMap"), { ssr: false });

const COLORS = {
  primary: "bg-[#2856c2] hover:bg-[#3a6aff]",
  accent: "text-[#3ab4ff]",
  card: "bg-gray-900/70 backdrop-blur-md border border-gray-700/40",
  background: "bg-gray-800",
};

export default function LostFound() {
  const [mode, setMode] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    itemName: "",
    description: "",
    image: "",
    policeStationName: "",
    policeStationId: "",
  });
  const [verifiedStation, setVerifiedStation] = useState(null);
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [address, setAddress] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState("");
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  // 🧭 Fetch items from DB
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

  // 🌍 Get user location
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


  // 📸 Image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setForm({ ...form, image: reader.result });
    reader.readAsDataURL(file);
  };

  // ✅ Verify Police Station ID before submitting
 const verifyPoliceStation = async (id) => {
  try {
    const res = await fetch(`/api/police-station/verify?id=${id}`);
    const data = await res.json();
    if (data.success) {
      setVerifiedStation(data.station);
      return data.station; // ✅ Return the station
    } else {
      setVerifiedStation(null);
      return null;
    }
  } catch (err) {
    console.error("Verification error:", err);
    return null;
  }
};


  // 🚀 Handle Form Submission
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!location.lat) return alert("Please pick your location.");
  if (!form.policeStationId) return alert("Enter police station ID.");

  setLoading(true);

  const station = await verifyPoliceStation(form.policeStationId);
  if (!station) {
    setLoading(false);
    alert("Invalid Police Station ID — please enter a valid one.");
    return;
  }

  const res = await fetch("/api/lostfound", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...form,
      policeStationId: station.stationId,  // ✅ store ID
      policeStationName: station.name,     // ✅ store readable name
      type: "Found",
      location,
      address,
    }),
  });

  const data = await res.json();
  setLoading(false);

  if (data.success) {
    setNotification("✅ Item submitted successfully!");
    setForm({
      name: "",
      email: "",
      itemName: "",
      description: "",
      image: "",
      policeStationId: "",
    });
    setVerifiedStation(null);
    setLocation({ lat: null, lng: null });
    setAddress("");
    fetchItems();
  } else {
    setNotification("❌ Error submitting item.");
  }
};


  // 🔎 Filter for Lost view
  const filteredItems = items.filter(
    (item) =>
      item.type === "Found" &&
      (item.address?.toLowerCase().includes(search.toLowerCase()) ||
        item.itemName?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div
      className={`${COLORS.background} min-h-screen text-gray-100 px-6 sm:px-10 pt-[110px] pb-10`}
    >
      {/* ✅ Notification */}
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-6 right-6 mt-[70px] bg-gray-900 text-white px-6 py-4 rounded-xl border-l-4 border-[#3ab4ff] shadow-lg flex items-center justify-between w-[350px] z-50"
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

      {/* 🏁 Header */}
      <motion.header
        className="max-w-6xl mx-auto mb-10 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3">
          🧳 Lost & Found <span className={COLORS.accent}>Portal</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Report or recover lost items easily with live location tracking and
          police verification.
        </p>
        <div className="h-1 w-24 bg-gradient-to-r from-[#3ab4ff] to-[#2856c2] mx-auto mt-5 rounded-full" />
      </motion.header>

      {/* 🚪 Mode Selection */}
      {!mode && (
        <div className="flex justify-center gap-6 mb-12">
          <button
            onClick={() => setMode("found")}
            className={`${COLORS.primary} text-white py-4 px-8 rounded-xl text-xl font-bold shadow-lg`}
          >
            🧍‍♂️ I Found an Item
          </button>
          <button
            onClick={() => setMode("lost")}
            className="bg-gray-800 hover:bg-gray-700 text-white py-4 px-8 rounded-xl text-xl font-bold shadow-lg"
          >
            😢 I Lost an Item
          </button>
        </div>
      )}

      {/* 🧍‍♂️ FOUND MODE */}
      {mode === "found" && (
        <div className="flex flex-col md:flex-row max-w-6xl mx-auto gap-10">
          <motion.form
            onSubmit={handleSubmit}
            className={`${COLORS.card} p-8 rounded-2xl shadow-xl flex-1 space-y-6 h-fit`}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-2xl font-bold text-white border-b border-gray-700 pb-3 mb-4">
              📝 Report Found Item
            </h2>

            <input
              className="w-full bg-gray-800/60 text-white border border-gray-700 p-3 rounded-lg"
              placeholder="Your Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              type="email"
              className="w-full bg-gray-800/60 text-white border border-gray-700 p-3 rounded-lg"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <input
              className="w-full bg-gray-800/60 text-white border border-gray-700 p-3 rounded-lg"
              placeholder="Item Name"
              value={form.itemName}
              onChange={(e) => setForm({ ...form, itemName: e.target.value })}
              required
            />
            <textarea
              className="w-full bg-gray-800/60 text-white border border-gray-700 p-3 rounded-lg resize-none"
              placeholder="Describe the item"
              rows="3"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              required
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full bg-gray-800/60 text-white border border-gray-700 p-3 rounded-lg cursor-pointer"
            />
            {form.image && (
              <img
                src={form.image}
                alt="preview"
                className="rounded-lg w-32 h-32 object-cover border border-[#3ab4ff]/40 mt-2"
              />
            )}

            {/* 🔐 Police Station ID Validation */}
            <input
              className="w-full bg-gray-800/60 text-white border border-gray-700 p-3 rounded-lg"
              placeholder="Enter Verified Police Station ID (e.g. PS-DEL-001)"
              value={form.policeStationId}
              onChange={(e) =>
                setForm({ ...form, policeStationId: e.target.value })
              }
              required
            />

            {verifiedStation && (
              <div className="p-3 bg-green-900/40 border border-green-600/50 rounded-lg text-sm">
                ✅ Verified: {verifiedStation.name} ({verifiedStation.city})
              </div>
            )}

            <button
              type="button"
              onClick={getLocation}
              className="bg-[#3ab4ff] hover:bg-[#2856c2] text-white w-full py-3 rounded-lg font-semibold"
            >
              🛰 Get My Current Location
            </button>
            {address && (
              <div className="p-3 bg-[#3ab4ff]/10 border border-[#3ab4ff]/50 rounded-lg text-sm">
                <p className="font-semibold text-[#3ab4ff]">📍 {address}</p>
              </div>
            )}

            <button
              type="submit"
              className={`${COLORS.primary} text-white w-full py-3 rounded-lg font-extrabold text-lg ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Submitting..." : "🚀 Submit Found Item"}
            </button>
          </motion.form>

          {/* Map Display */}
          <motion.div
            className="flex-1 min-h-[500px] rounded-2xl overflow-hidden shadow-2xl border-4 border-[#3ab4ff]/50"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <UserMap
              complaints={items}
              location={location}
              setLocation={setLocation}
              setAddress={setAddress}
            />
          </motion.div>
        </div>
      )}

      {/* 😢 LOST MODE */}
      {mode === "lost" && (
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex justify-between items-center mb-6">
            <input
              type="text"
              placeholder="🔍 Search by city or item name..."
              className="w-full md:w-1/2 bg-gray-800/60 text-white border border-gray-700 p-3 rounded-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              onClick={() => setMode(null)}
              className="ml-4 text-sm bg-gray-700 px-4 py-2 rounded-lg"
            >
              ← Back
            </button>
          </div>

          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <motion.div
                  key={item._id}
                  className={`${COLORS.card} p-5 rounded-xl`}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedItem(item)}
                >
                  <img
                    src={item.image}
                    alt={item.itemName}
                    className="rounded-lg h-40 w-full object-cover mb-3"
                  />
                  <h3 className="text-xl font-bold text-[#3ab4ff]">
                    {item.itemName}
                  </h3>
                  <p className="text-gray-300 text-sm mt-1">
                    {item.description}
                  </p>
                  <p className="text-gray-400 text-xs mt-2">
                    📍 {item.address}
                  </p>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center mt-10">
              No items found in this area.
            </p>
          )}
        </motion.div>
      )}

      {/* 📞 Contact Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              className="bg-gray-900 p-6 rounded-2xl w-full max-w-md relative shadow-2xl border border-gray-700"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-white"
                onClick={() => setSelectedItem(null)}
              >
                ✖
              </button>

              <img
                src={selectedItem.image}
                alt={selectedItem.itemName}
                className="rounded-lg w-full h-40 object-cover mb-4"
              />

              <h2 className="text-2xl font-bold text-[#3ab4ff] mb-2">
                {selectedItem.itemName}
              </h2>
              <p className="text-gray-300 text-sm mb-2">
                {selectedItem.description}
              </p>
              <p className="text-gray-400 text-sm mb-2">
                📍 {selectedItem.address}
              </p>
              <p className="text-gray-300 font-semibold mb-2">
                👮 Police Station:{" "}
                <span className="text-[#3ab4ff]">
                  {selectedItem.policeStationId || "N/A"}
                </span>
              </p>
              <p className="text-gray-400 text-sm mb-4">
                📧 Contact Email: {selectedItem.email || "Not provided"}
              </p>

              {selectedItem.location?.lat && (
                <div className="h-48 rounded-lg overflow-hidden border border-[#3ab4ff]/50">
                  <UserMap
                    complaints={[selectedItem]}
                    location={selectedItem.location}
                  />
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-400 rounded-full blur-3xl opacity-20 animate-pulse" />
    </div>
  );
}
