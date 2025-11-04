"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function CommunityEvents() {
  const [events, setEvents] = useState([]);
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch events from API
  const fetchEvents = async (selectedCity = "") => {
    setLoading(true);
    try {
      const query = selectedCity ? `?city=${selectedCity}` : "";
      const res = await fetch(`/api/community-events${query}`);
      const data = await res.json();
      if (data.success) setEvents(data.events);
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-800 pt-[110px] px-6 pb-16">
      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-extrabold text-center mb-8"
      >
        🌿{" "}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
          Green Community Events
        </span>
      </motion.h1>

      {/* Search bar */}
      <div className="max-w-md mx-auto mb-10 flex items-center gap-3">
        <input
          type="text"
          placeholder="🔍 Search events by city..."
          className="flex-1 bg-white border border-gray-300 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button
          onClick={() => fetchEvents(city)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold transition"
        >
          Search
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-center text-gray-500 animate-pulse">Loading events...</p>
      )}

      {/* Events Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.length > 0 ? (
          events.map((event) => (
            <motion.div
              key={event._id}
              className="bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-xl transition p-5"
              whileHover={{ scale: 1.02 }}
            >
              {event.image && (
                <img
                  src={event.image}
                  alt={event.title}
                  className="rounded-lg h-48 w-full object-cover mb-4"
                />
              )}
              <h3 className="text-2xl font-bold text-blue-700 mb-2">
                {event.title}
              </h3>
              <p className="text-gray-600 text-sm mb-1">
                📅 {new Date(event.date).toLocaleDateString()} | 📍{" "}
                <span className="font-medium text-gray-800">{event.venue}</span>
              </p>
              {event.city && (
                <p className="text-gray-500 text-sm mb-2">🏙️ {event.city}</p>
              )}
              <p className="text-gray-700 text-sm mb-3 leading-relaxed">
                {event.description}
              </p>
              {event.organizer && (
                <p className="text-gray-500 text-sm">
                  👥 Organized by:{" "}
                  <span className="text-blue-600 font-medium">
                    {event.organizer}
                  </span>
                </p>
              )}
            </motion.div>
          ))
        ) : (
          !loading && (
            <p className="text-center text-gray-500 col-span-full">
              No events found for this city.
            </p>
          )
        )}
      </div>
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-400 rounded-full blur-3xl opacity-20 animate-pulse" />
    </div>
  );
}
