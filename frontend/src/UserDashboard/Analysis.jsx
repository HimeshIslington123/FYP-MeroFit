import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import { ArrowUp, ArrowDown } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);

const Analysis = () => {
  const [weightHistory, setWeightHistory] = useState([]);
  const [calorieLogs, setCalorieLogs] = useState([]);
  const [todayMacros, setTodayMacros] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [weightRes, logRes, todayRes] = await Promise.all([
          axios.get("http://localhost:4000/api/weightchanges/weight-history", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:4000/TrackCalories/all", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:4000/TrackCalories/today", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setWeightHistory(weightRes.data || []);
        setCalorieLogs(logRes.data.logs || []);
        setTodayMacros(todayRes.data.log || null);
      } catch (err) {
        console.error("Error fetching analytics:", err);
      }
    };

    if (token) fetchData();
  }, [token]);

  // ===================== CHART DATA =====================
  const weightData = {
    labels: weightHistory.map((w) =>
      new Date(w.recordedAt).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Weight (kg)",
        data: weightHistory.map((w) => w.weight),
        borderColor: "#2bb3a3",
        backgroundColor: "rgba(43, 179, 163, 0.2)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#2bb3a3",
        pointBorderColor: "#2bb3a3",
      },
    ],
  };

  const last7 = calorieLogs.slice(0, 7).reverse();
  const calorieData = {
    labels: last7.map((log) => log.date),
    datasets: [
      {
        label: "Calories",
        data: last7.map((log) => log.totalCalories),
        backgroundColor: "#2bb3a3",
        borderRadius: 6,
      },
    ],
  };

  const macroData =
    todayMacros &&
    todayMacros.totalProtein !== undefined && {
      labels: ["Protein", "Carbs", "Fat"],
      datasets: [
        {
          data: [
            todayMacros.totalProtein,
            todayMacros.totalCarb,
            todayMacros.totalFat,
          ],
          backgroundColor: ["#2bb3a3", "#ffffff", "#444444"],
          borderColor: "#000",
          borderWidth: 2,
        },
      ],
    };

  const weightDiff =
    weightHistory.length > 1
      ? Math.round(
          weightHistory[weightHistory.length - 1].weight -
            weightHistory[weightHistory.length - 2].weight
        )
      : null;

  return (
    <div className=" min-h-screen text-black">
      <h2 className="text-2xl  text-[#2bb3a3] mb-8 text-center">
        Fitness Analytics
      </h2>

      {/* First row: Weight + Calories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Weight Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-light text-black">Weight Progress</h3>
            {weightDiff !== null && (
              <span className="flex items-center gap-1 bg-[#fdf3e7] text-[#e67e22] px-2 py-1 text-[12px] rounded-full">
                {weightDiff > 0 ? (
                  <ArrowUp size={14} className="text-[#e67e22]" />
                ) : (
                  <ArrowDown size={14} className="text-[#e67e22]" />
                )}
                {weightDiff > 0 ? "+" : ""}
                {weightDiff} kg
              </span>
            )}
          </div>
          {weightHistory.length > 0 ? (
            <Line
              data={weightData}
              options={{
                responsive: true,
                plugins: { legend: { display: true } },
                scales: { x: { grid: { display: false } }, y: { grid: { display: false } } },
              }}
            />
          ) : (
            <p className="text-gray-400 text-sm">No weight data available</p>
          )}
        </div>

        {/* Last 7 Days Calories */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-light text-black">Last 7 Days Calories</h3>
            {last7.length > 0 && (
              <span className="bg-[#fdf3e7] text-[#e67e22] text-[12px] px-2 py-1 rounded-full">
                Avg{" "}
                {Math.round(
                  last7.reduce((sum, log) => sum + log.totalCalories, 0) / last7.length
                )}
              </span>
            )}
          </div>
          {last7.length > 0 ? (
            <Bar
              data={calorieData}
              options={{
                responsive: true,
                plugins: { legend: { display: true } },
                scales: { x: { grid: { display: false } }, y: { grid: { display: false } } },
              }}
            />
          ) : (
            <p className="text-gray-400 text-sm">No calorie data available</p>
          )}
        </div>
      </div>

      {/* Second row: Macros */}
      <div className="w-[40%] mx-auto">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-light text-black mb-4">Today's Macros</h3>
          {macroData ? (
            <Doughnut
              data={macroData}
              options={{
                responsive: true,
                plugins: { legend: { labels: { color: "#000" } } },
              }}
            />
          ) : (
            <p className="text-gray-400 text-sm">No data logged today</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analysis;