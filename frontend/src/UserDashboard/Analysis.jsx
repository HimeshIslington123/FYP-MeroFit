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

    if (token) {
      fetchData();
    }
  }, [token]);

  // ================= WEIGHT GRAPH =================
  const weightData = {
    labels: weightHistory.map((w) =>
      new Date(w.recordedAt).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Weight (kg)",
        data: weightHistory.map((w) => w.weight),
        borderColor: "blue",
        backgroundColor: "rgba(0,0,255,0.2)",
        tension: 0.4,
      },
    ],
  };

  // ================= LAST 7 DAYS CALORIES =================
  const last7 = calorieLogs.slice(0, 7).reverse();

  const calorieData = {
    labels: last7.map((log) => log.date),
    datasets: [
      {
        label: "Calories",
        data: last7.map((log) => log.totalCalories),
        backgroundColor: "orange",
      },
    ],
  };

  // ================= TODAY MACROS =================
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
          backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"],
        },
      ],
    };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Fitness Analytics</h2>

      {/* Weight Progress */}
      <div style={{ width: "600px", marginBottom: "40px" }}>
        <h4>Weight Progress</h4>
        {weightHistory.length > 0 ? (
          <Line data={weightData} />
        ) : (
          <p>No weight data available</p>
        )}
      </div>

      {/* Last 7 Days Calories */}
      <div style={{ width: "600px", marginBottom: "40px" }}>
        <h4>Last 7 Days Calories</h4>
        {last7.length > 0 ? (
          <Bar data={calorieData} />
        ) : (
          <p>No calorie logs available</p>
        )}
      </div>

      {/* Today's Macros */}
      <div style={{ width: "400px" }}>
        <h4>Today's Macros</h4>
        {macroData ? (
          <Doughnut data={macroData} />
        ) : (
          <p>No data logged today</p>
        )}
      </div>
    </div>
  );
};

export default Analysis;