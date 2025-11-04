"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function InsightsPage() {
  // --- Dummy Data ---
  const complaintsByType = [
    { name: "Water", value: 40 },
    { name: "Road", value: 25 },
    { name: "Electricity", value: 20 },
    { name: "Lost & Found", value: 15 },
  ];

  const complaintsByArea = [
    { area: "North Zone", complaints: 50 },
    { area: "South Zone", complaints: 35 },
    { area: "East Zone", complaints: 25 },
    { area: "West Zone", complaints: 30 },
  ];

  const weeklyTrends = [
    { day: "Mon", count: 12 },
    { day: "Tue", count: 15 },
    { day: "Wed", count: 10 },
    { day: "Thu", count: 20 },
    { day: "Fri", count: 14 },
    { day: "Sat", count: 18 },
    { day: "Sun", count: 8 },
  ];

  const ngoData = [
    { name: "CleanCity", reports: 34 },
    { name: "GreenHands", reports: 25 },
    { name: "RoadSafe", reports: 15 },
    { name: "LightUp", reports: 12 },
  ];

  return (
    <div className="bg-gray-900 min-h-screen   text-gray-100 p-6 sm:p-10 pt-[110px]">
      {/* Header */}
      <motion.h1
        className="text-5xl font-extrabold pt-[100px] text-center mb-12 text-[#3ab4ff]"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Insights & Analytics
      </motion.h1>

      {/* Statistic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-6xl mx-auto">
        {[
          { title: "Complaints Solved Today", value: 28, color: "bg-emerald-600" },
          { title: "Pending Complaints", value: 15, color: "bg-yellow-500" },
          { title: "Total NGOs Involved", value: 10, color: "bg-blue-600" },
        ].map((card, i) => (
          <motion.div
            key={i}
            className={`p-6 rounded-2xl shadow-xl text-center ${card.color} bg-opacity-90 backdrop-blur-md`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.2 }}
          >
            <h2 className="text-lg font-semibold text-white">{card.title}</h2>
            <p className="text-4xl font-extrabold mt-2">{card.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12 max-w-6xl mx-auto">
        {/* Pie Chart - Complaints by Type */}
        <motion.div
          className="bg-gray-900/80 rounded-2xl p-6 shadow-lg border border-gray-700/40"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-xl font-bold mb-4 text-[#3ab4ff]">
            Complaints by Type
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={complaintsByType}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {complaintsByType.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Bar Chart - Complaints by Area */}
        <motion.div
          className="bg-gray-900/80 rounded-2xl p-6 shadow-lg border border-gray-700/40"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-xl font-bold mb-4 text-[#3ab4ff]">
            Complaints by Area
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={complaintsByArea}>
              <XAxis dataKey="area" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Bar dataKey="complaints" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Line Chart - Weekly Trends */}
      <motion.div
        className="bg-gray-900/80 rounded-2xl p-6 shadow-lg border border-gray-700/40 mb-12 max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h3 className="text-xl font-bold mb-4 text-[#3ab4ff]">
          Weekly Complaint Trends
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={weeklyTrends}>
            <XAxis dataKey="day" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* NGO Leaderboard */}
      <motion.div
        className="bg-gray-900/80 rounded-2xl p-6 shadow-lg border border-gray-700/40 max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h3 className="text-xl font-bold mb-4 text-[#3ab4ff]">
          NGO Contributions
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={ngoData} layout="vertical">
            <XAxis type="number" stroke="#ccc" />
            <YAxis dataKey="name" type="category" stroke="#ccc" />
            <Tooltip />
            <Bar dataKey="reports" fill="#f59e0b" radius={[0, 10, 10, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
      <div className="absolute -top-40 -left-40 w-56 h-56 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse" />
      <div className="absolute -bottom-40 -right-40 w-56 h-56 bg-cyan-400 rounded-full blur-3xl opacity-20 animate-pulse" />
    </div>
  );
}
