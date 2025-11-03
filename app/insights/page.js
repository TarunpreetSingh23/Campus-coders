"use client";
import { useEffect, useState } from "react";
import {
  Bar,
  Doughnut,
  Line
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

export default function Dashboard() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await fetch("/api/complaints");
        const data = await res.json();
        if (data.success) setComplaints(data.complaints);
      } catch (err) {
        console.error("Error fetching complaints:", err);
      }
    };
    fetchComplaints();
  }, []);

  // ======== DATA PROCESSING ========

  const types = ["Road", "Water", "Electricity", "Waste", "Other"];
  const statuses = ["Pending", "In Progress", "Resolved"];

  const typeCount = types.map(
    (t) => complaints.filter((c) => c.type === t).length
  );

  const statusCount = statuses.map(
    (s) => complaints.filter((c) => c.status === s).length
  );

  // Group by date (daily)
  const dailyCounts = complaints.reduce((acc, c) => {
    const date = new Date(c.createdAt).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});
  const dates = Object.keys(dailyCounts);
  const dateValues = Object.values(dailyCounts);

  // ======== CHART DATA ========

  const typeData = {
    labels: types,
    datasets: [
      {
        label: "Complaints by Type",
        data: typeCount,
        backgroundColor: ["#4ADE80", "#60A5FA", "#FACC15", "#F87171", "#A78BFA"],
      },
    ],
  };

  const statusData = {
    labels: statuses,
    datasets: [
      {
        label: "Complaints by Status",
        data: statusCount,
        backgroundColor: ["#F87171", "#FACC15", "#4ADE80"],
      },
    ],
  };

  const trendData = {
    labels: dates,
    datasets: [
      {
        label: "Complaints Over Time",
        data: dateValues,
        borderColor: "#60A5FA",
        backgroundColor: "rgba(96,165,250,0.2)",
        fill: true,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-100 to-indigo-100 p-8">
      <h1 className="text-4xl font-extrabold text-center text-indigo-800 mb-10">
        📊 Complaint Insights Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Bar Chart - Type */}
        <div className="bg-white rounded-3xl shadow-lg p-6 border">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 text-center">
            Complaints by Type
          </h2>
          <Bar data={typeData} />
        </div>

        {/* Doughnut Chart - Status */}
        <div className="bg-white rounded-3xl shadow-lg p-6 border">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 text-center">
            Complaints by Status
          </h2>
          <Doughnut data={statusData} />
        </div>

        {/* Line Chart - Time Trend */}
        <div className="bg-white rounded-3xl shadow-lg p-6 border md:col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 text-center">
            Complaints Trend Over Time
          </h2>
          <Line data={trendData} />
        </div>
      </div>
    </div>
  );
}
