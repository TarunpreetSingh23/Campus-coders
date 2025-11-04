"use client";

import { motion } from "framer-motion";

const visionData = [
  {
    title: "Our Vision",
    text: "To build a transparent, tech-enabled platform that bridges citizens, police, and NGOs — ensuring every issue is resolved efficiently and with trust.",
    color: "from-blue-400 to-blue-600",
    align: "left",
  },
  {
    title: "Our Mission",
    text: "To empower communities through digital collaboration — where innovation, empathy, and accountability work hand in hand for public service.",
    color: "from-sky-400 to-indigo-500",
    align: "right",
  },
  {
    title: "Our Future",
    text: "Expanding our ecosystem across cities with AI-driven insights, smart reporting tools, and stronger partnerships to make governance people-centric.",
    color: "from-cyan-400 to-blue-500",
    align: "left",
  },
];

export default function VisionSection() {
  return (
    <section className="relative py-24 px-6 bg-gradient-to-b from-blue-50 to-white text-gray-900 overflow-hidden">
      {/* Heading */}
      <h2 className="text-center text-4xl font-extrabold mb-16 tracking-wide">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
          Our Vision & Mission
        </span>
      </h2>

      {/* Vision Circles */}
      <div className="flex flex-col items-center space-y-12 max-w-3xl mx-auto">
        {visionData.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className={`relative flex ${
              item.align === "left" ? "justify-start" : "justify-end"
            } w-full`}
          >
            {/* Gradient Outer Circle */}
            <div
              className={`w-80 h-80 rounded-full bg-gradient-to-br ${item.color} p-[2px] shadow-xl`}
            >
              {/* Inner Glass Effect */}
              <div className="w-full h-full rounded-full bg-white/60 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 shadow-inner border border-white/70 hover:shadow-lg hover:shadow-blue-400/30 transition-shadow">
                <h3 className="text-2xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-cyan-700">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {item.text}
                </p>
              </div>
            </div>

            {/* Glow Background */}
            <div
              className={`absolute inset-0 blur-3xl opacity-40 bg-gradient-to-br ${item.color} rounded-full -z-10 ${
                item.align === "left"
                  ? "translate-x-[-25%]"
                  : "translate-x-[25%]"
              }`}
            ></div>
          </motion.div>
        ))}
      </div>

      {/* Decorative subtle gradient line */}
      <div className="absolute top-0 left-1/2 w-[1px] h-full bg-gradient-to-b from-blue-300 via-blue-200 to-transparent opacity-30"></div>
    </section>
  );
}
