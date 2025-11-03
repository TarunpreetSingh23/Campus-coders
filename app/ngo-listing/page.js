"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function NgoListing() {
  const [ngos, setNgos] = useState([]);
  const [selectedNgo, setSelectedNgo] = useState(null);

  const fetchNgos = async () => {
    try {
      const res = await fetch("/api/ngo-listing");
      const data = await res.json();
      if (data.success) setNgos(data.ngos);
    } catch (err) {
      console.error("Error fetching NGOs:", err);
    }
  };

  useEffect(() => {
    fetchNgos();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-100 to-teal-100 p-8">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-emerald-800">
        🌿 Explore NGOs Around You
      </h1>

      {/* NGO List */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {ngos.map((ngo) => (
          <motion.div
            key={ngo._id}
            onClick={() => setSelectedNgo(ngo)}
            whileHover={{ scale: 1.03 }}
            className="cursor-pointer bg-white p-6 rounded-2xl shadow-md border hover:shadow-lg transition"
          >
            {ngo.logo && (
              <img
                src={ngo.logo}
                alt={ngo.name}
                className="w-20 h-20 rounded-full object-cover mx-auto mb-3"
              />
            )}
            <h2 className="text-xl font-bold text-center text-emerald-700">
              {ngo.name}
            </h2>
            <p className="text-sm text-center text-gray-600">{ngo.type}</p>
            <p className="mt-3 text-gray-700 text-center line-clamp-3">
              {ngo.description}
            </p>
          </motion.div>
        ))}
      </div>

      {/* NGO Detail Modal */}
      <AnimatePresence>
        {selectedNgo && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-3xl p-8 max-w-lg w-full relative shadow-2xl overflow-y-auto max-h-[90vh]"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <button
                className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl"
                onClick={() => setSelectedNgo(null)}
              >
                ✖
              </button>

              {selectedNgo.logo && (
                <img
                  src={selectedNgo.logo}
                  alt={selectedNgo.name}
                  className="w-28 h-28 rounded-full object-cover mx-auto mb-4 border"
                />
              )}
              <h2 className="text-2xl font-bold text-center text-emerald-800 mb-2">
                {selectedNgo.name}
              </h2>
              <p className="text-center text-gray-600 mb-4">
                {selectedNgo.type}
              </p>
              <p className="text-gray-700 mb-4">{selectedNgo.mission}</p>

              <div className="border-t border-gray-300 pt-4 text-sm space-y-2">
                {selectedNgo.address && (
                  <p>
                    📍 <strong>Address:</strong> {selectedNgo.address}
                  </p>
                )}
                {selectedNgo.phone && (
                  <p>
                    📞 <strong>Phone:</strong> {selectedNgo.phone}
                  </p>
                )}
                {selectedNgo.contactEmail && (
                  <p>
                    📧 <strong>Email:</strong>{" "}
                    <a
                      href={`mailto:${selectedNgo.contactEmail}`}
                      className="text-emerald-700 underline"
                    >
                      {selectedNgo.contactEmail}
                    </a>
                  </p>
                )}
                {selectedNgo.website && (
                  <p>
                    🌐 <strong>Website:</strong>{" "}
                    <a
                      href={selectedNgo.website}
                      target="_blank"
                      className="text-emerald-700 underline"
                    >
                      {selectedNgo.website}
                    </a>
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
