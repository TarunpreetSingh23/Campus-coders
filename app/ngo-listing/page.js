"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function NgosPage() {
  const [ngos, setNgos] = useState([]);
  const [selectedNGO, setSelectedNGO] = useState(null);

  // Fetch from DB
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/ngo-listing");
        const data = await res.json();
        if (data.success) setNgos(data.ngos);
      } catch (err) {
        console.error("Error fetching NGOs:", err);
      }
    };
    fetchData();
  }, []);

  // Animation variants
  const cardVariants = {
    hiddenLeft: { opacity: 0, x: -80 },
    hiddenRight: { opacity: 0, x: 80 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-gray-800 text-gray-100 pt-[110px] pb-20 px-6 sm:px-10">
      {/* Header */}
      <motion.header
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3">
          🌍 Active <span className="text-[#3ab4ff]">NGOs</span> & Their Contributions
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Discover NGOs working to make a difference — from healthcare and education to environment and empowerment.
        </p>
        <div className="h-1 w-24 bg-gradient-to-r from-[#3ab4ff] to-[#2856c2] mx-auto mt-5 rounded-full" />
      </motion.header>

      {/* NGO Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {ngos.map((ngo, index) => (
          <motion.div
            key={ngo._id || ngo.id}
            variants={cardVariants}
            initial={index % 2 === 0 ? "hiddenLeft" : "hiddenRight"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            onClick={() => setSelectedNGO(ngo)}
            className="bg-gray-900/70 backdrop-blur-md border border-gray-700/40 rounded-2xl shadow-lg hover:shadow-[#3ab4ff]/30 hover:border-[#3ab4ff]/40 transition-all p-6 cursor-pointer"
          >
            <h2 className="text-2xl font-semibold text-white mb-2">
              {ngo.name}
            </h2>
            <p className="text-gray-400 text-sm mb-3">
              {ngo.contribution}
            </p>
            <p className="text-gray-500 text-sm line-clamp-3">
              {ngo.details}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Modal for NGO Details */}
      <AnimatePresence>
        {selectedNGO && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-900/90 border border-gray-700/50 rounded-2xl shadow-2xl p-8 sm:p-10 max-w-2xl w-full relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedNGO(null)}
                className="absolute top-5 right-5 text-gray-400 hover:text-[#3ab4ff] transition"
              >
                <X size={28} />
              </button>

              {/* Modal Content */}
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                {selectedNGO.name}
              </h2>
              <p className="text-gray-300 mb-5 leading-relaxed">
                {selectedNGO.details}
              </p>
              <p className="text-[#3ab4ff] font-semibold border-t border-gray-700 pt-3">
                Recent Contribution:{" "}
                <span className="text-gray-200 font-normal">
                  {selectedNGO.contribution}
                </span>
              </p>

              <button
                onClick={() => setSelectedNGO(null)}
                className="mt-8 bg-[#2856c2] hover:bg-[#3ab4ff] text-white px-6 py-3 rounded-xl shadow-lg font-semibold transition-all"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-400 rounded-full blur-3xl opacity-20 animate-pulse" />
    </div>
  );
}
