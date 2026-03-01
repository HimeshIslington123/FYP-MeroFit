import React, { useEffect, useState } from "react";
import axios from "axios";
import { Users, DollarSign, UserCheck, FileText } from "lucide-react";
import Navbar from "../AdminDashboardComponent/Navbar";

const AdminHome = () => {
  const [statsData, setStatsData] = useState({
    totalUsers: 0,
    totalTrainers: 0,
    totalEarning: 0,
    totalBlogs: 0,
  });

  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);

      // 1️⃣ Get Admin Stats (users, trainers, earnings)
      const statsRes = await axios.get(
        "http://localhost:4000/api/recommendation/admin/stats",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 2️⃣ Get Blogs
      const blogRes = await axios.get(
        "http://localhost:4000/api/blog/blogs"
      );

      setStatsData({
        totalUsers: statsRes.data.totalUsers || 0,
        totalTrainers: statsRes.data.totalTrainers || 0,
        totalEarning: statsRes.data.totalEarning || 0,
        totalBlogs: blogRes.data.length || 0,
      });

    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      label: "Total Users",
      value: statsData.totalUsers,
      unit: "",
      icon: Users,
    },
    {
      label: "Total Trainers",
      value: statsData.totalTrainers,
      unit: "",
      icon: UserCheck,
    },
    {
      label: "Total Earnings",
      value: statsData.totalEarning,
      unit: "Rs",
      icon: DollarSign,
    },
    {
      label: "Total Blogs",
      value: statsData.totalBlogs,
      unit: "",
      icon: FileText,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="bg-white p-8 border rounded-2xl border-gray-100 shadow-sm hover:shadow-md cursor-pointer group flex flex-col transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-[#2bb3a3]/30 rounded-xl group-hover:bg-[#2bb3a3]/10 transition-colors">
                  <Icon size={24} className="text-[#2bb3a3]" />
                </div>
              </div>

              {loading ? (
                <h3 className="text-gray-400 text-xl">Loading...</h3>
              ) : (
                <h3 className="text-black text-3xl mb-1 font-semibold">
                  {stat.unit === "Rs" && "Rs "}
                  {stat.value}
                  <span className="text-gray-500 text-lg ml-1">
                    {stat.unit !== "Rs" ? stat.unit : ""}
                  </span>
                </h3>
              )}

              <p className="text-gray-400 text-sm mt-2">
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminHome;