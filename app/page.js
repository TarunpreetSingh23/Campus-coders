"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import HeroCarousel from "@/components/herocarosel";
const UserMap = dynamic(() => import("@/components/UseMap"), { ssr: false });


// --- Recharts for Graph ---
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
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

// --- Recent Complaints Section ---
const RecentComplaints = () => {
  const [complaints, setComplaints] = useState([]);
   const [complaintsmap, setComplaintsmap] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchComplaintsmap = async () => {
    try {
      const res = await fetch("/api/complaints");
      const data = await res.json();
      if (data.success) setComplaintsmap(data.complaintsmap);
    } catch (err) {
      console.error("Error fetching complaints:", err);
    }
  };

  useEffect(() => {
    fetchComplaintsmap();
  }, []);

  useEffect(() => {
    async function fetchComplaints() {
      try {
        const res = await fetch("/api/solved");
        const data = await res.json();
        const formatted = Array.isArray(data)
          ? data
          : Array.isArray(data.complaints)
          ? data.complaints
          : [];
        setComplaints(formatted);
      } catch (error) {
        console.error("Error fetching complaints:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchComplaints();
  }, []);

  if (loading)
    return (
      <p className="text-center text-gray-500 mt-10 animate-pulse">
        Loading recent complaints...
      </p>
    );

  if (complaints.length === 0)
    return (
      <p className="text-center text-gray-500 mt-10">
        No solved complaints yet.
      </p>
    );

  return (
    <div className="max-w-2xl mx-auto mt-10 space-y-6">
      {complaints.map((c) => (
        <motion.div
          key={c._id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-b from-blue-50 to-white border border-gray-200 rounded-3xl shadow-md hover:shadow-lg transition-all p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <img
                src={"/images/default-avatar.png"}
                alt="User"
                className="w-11 h-11 rounded-full border border-gray-300"
              />
              <div className="ml-3">
                <h4 className="font-semibold text-gray-900">
                  {c.name || "Anonymous"}
                </h4>
                <p className="text-xs text-gray-500">
                  {new Date(c.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            <span
              className={`text-xs px-3 py-1 rounded-full font-medium ${
                c.status === "Resolved"
                  ? "bg-green-100 text-green-600"
                  : c.status === "In Progress"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {c.status}
            </span>
          </div>

          <p className="text-gray-800 leading-relaxed mb-3">{c.complaint}</p>

          {c.address && (
            <p className="text-sm text-gray-500 mb-3">
              📍 <span className="italic">{c.address}</span>
            </p>
          )}

          {c.department && (
            <p className="text-sm text-purple-600 mb-3">
              🏢 Assigned to: <span className="font-medium">{c.department}</span>
            </p>
          )}

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-medium">
              {c.type || "General"}
            </span>
          </div>

          {/* <div className="flex justify-between text-gray-500 text-sm border-t border-gray-100 pt-3">
            <button className="flex items-center gap-2 hover:text-red-500 transition">
              ❤️ <span>Like</span>
            </button>
            <button className="flex items-center gap-2 hover:text-blue-500 transition">
              💬 <span>Comment</span>
            </button>
            <button className="flex items-center gap-2 hover:text-gray-800 transition">
              🔁 <span>Share</span>
            </button>
          </div> */}
        </motion.div>
      ))}
    </div>
  );
};

// --- Page Loader ---
function PageLoader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-900 z-50">
      <Image src="/images/LOGO (2).jpg" alt="Logo" width={180} height={60} className="mb-6" />
      <div className="w-48 h-1 bg-gray-700 rounded overflow-hidden">
        <div className="h-full bg-[#3ab4ff] animate-loaderLine"></div>
      </div>
    </div>
  );
}

// --- Footer ---


// --- Main Page ---
export default function Home() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);

  // Simulate small loader
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <PageLoader />;

  // Mock data for daily complaint trends
  const complaintData = [
    { time: "8 AM", count: 4 },
    { time: "10 AM", count: 7 },
    { time: "12 PM", count: 10 },
    { time: "2 PM", count: 8 },
    { time: "4 PM", count: 12 },
    { time: "6 PM", count: 9 },
  ];

  return (
    <>
      {/* Hero Section */}
      <div className="">
        <HeroCarousel />
      </div>

      {/* Recently Solved Complaints */}
      <section className="bg-gradient-to-b from-white to-blue-50 py-10 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">
              Recently <span className="text-[#2856c2]">Solved</span> Complaints
            </h2>
            <p className="text-lg text-gray-500">
              See how effectively citizen complaints are being resolved in real-time.
            </p>
            <div className="h-1 mx-auto w-24 bg-gradient-to-r from-pink-500 to-[#2856c2] rounded-full mt-4" />
          </div>
          <RecentComplaints />
        </div>
      </section>

      {/* Divider */}
      <div className="h-0.5 bg-gray-100 mx-auto max-w-7xl" />

      {/* Complaint Trends Graph */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Today’s <span className="text-[#2856c2]">Complaint Trends</span>
          </h2>
          <p className="text-lg text-gray-500 mb-10">
            Live insight into how complaints are being registered throughout the day.
          </p>

          <div className="bg-white border border-gray-100 shadow-xl rounded-3xl p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full h-80"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={complaintData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="time" stroke="#555" />
                  <YAxis stroke="#555" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#2856c2"
                    strokeWidth={3}
                    dot={{ r: 6, fill: "#2856c2" }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Complaint Map */}
      <section className="bg-gradient-to-b from-white to-blue-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Complaint <span className="text-[#2856c2]">Location Map</span>
          </h2>
          <p className="text-lg text-gray-500 mb-10">
            Visualize where complaints are being reported in real-time.
          </p>

          <div className="overflow-hidden rounded-3xl shadow-xl border border-gray-100">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31500.000000000004!2d77.5946!3d12.9716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670d8b9a4e3%3A0xe9dbe4b5c0a9b7f!2sBangalore!5e0!3m2!1sen!2sin!4v1698240000000!5m2!1sen!2sin"
              width="100%"
              height="450"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
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

      {/* Footer */}
    
    </>
  );
}
