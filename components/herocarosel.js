"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { Megaphone, MapPin, ClipboardList } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gray-900 ">
      {/* Background Image */}
      <Image
        src="/images/city-bg.jpg" // Replace with your own background
        alt="City Background"
        fill
        priority
        className="object-cover brightness-[0.4]"
      />

      {/* Content Container */}
      <div className="relative z-10 text-center px-6 sm:px-10 max-w-4xl">
        <motion.h1
          className="text-4xl sm:text-6xl font-extrabold text-white mb-6 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Report. Resolve. Rebuild.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            Your City, Your Voice.
          </span>
        </motion.h1>

        <motion.p
          className="text-lg sm:text-xl text-gray-300 mb-10 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Empowering citizens to take part in making their community cleaner,
          safer, and smarter. Submit complaints, track their status, and be a
          part of real-time civic improvement.
        </motion.p>

        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
        >
          <Link
            href="/submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-full font-medium shadow-lg transition-all"
          >
            Submit Your Complaint
          </Link>
        </motion.div>

        {/* Features Section */}
        <div className="grid sm:grid-cols-3 gap-6 mt-16 text-left">
          <motion.div
            className="bg-white/10 backdrop-blur-md rounded-3xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all"
            whileHover={{ scale: 1.05 }}
          >
            <Megaphone className="w-10 h-10 text-blue-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Easy Complaint Submission
            </h3>
            <p className="text-gray-300 text-sm">
              File a complaint in seconds with your location and details.
            </p>
          </motion.div>

          <motion.div
            className="bg-white/10 backdrop-blur-md rounded-3xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all"
            whileHover={{ scale: 1.05 }}
          >
            <MapPin className="w-10 h-10 text-cyan-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Location-Aware Reports
            </h3>
            <p className="text-gray-300 text-sm">
              Every complaint is mapped with real-time location tracking.
            </p>
          </motion.div>

          <motion.div
            className="bg-white/10 backdrop-blur-md rounded-3xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all"
            whileHover={{ scale: 1.05 }}
          >
            <ClipboardList className="w-10 h-10 text-indigo-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Track & Transparency
            </h3>
            <p className="text-gray-300 text-sm">
              Get real-time updates on your complaint’s progress and resolution.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Decorative Glow Effects */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-400 rounded-full blur-3xl opacity-20 animate-pulse" />
    </section>
  );
}
