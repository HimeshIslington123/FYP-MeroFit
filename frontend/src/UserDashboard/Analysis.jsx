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

  // ================= GLOBAL CHART OPTIONS =================
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "#ffffff",
        },
      },
      tooltip: {
        backgroundColor: "#111",
        titleColor: "#D8FF00",
        bodyColor: "#fff",
        borderColor: "#D8FF00",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: { color: "#ffffff" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
      y: {
        ticks: { color: "#ffffff" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
    },
  };

  // ================= WEIGHT GRAPH =================
  const weightData = {
    labels: weightHistory.map((w) =>
      new Date(w.recordedAt).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Weight (kg)",
        data: weightHistory.map((w) => w.weight),
        borderColor: "#D8FF00",
        backgroundColor: "rgba(216,255,0,0.2)",
        pointBackgroundColor: "#D8FF00",
        pointBorderColor: "#000",
        pointRadius: 5,
        tension: 0.4,
        fill: true,
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
        backgroundColor: "#D8FF00",
        borderRadius: 8,
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
          backgroundColor: [
            "#D8FF00", // Protein
            "#ffffff", // Carbs
            "#444444", // Fat
          ],
          borderWidth: 2,
          borderColor: "#000",
        },
      ],
    };

  return (
    <div
      style={{
        padding: "40px",
      
        minHeight: "100vh",
        color: "#fff",
      }}
    >
      <h2 style={{ marginBottom: "40px", color: "#D8FF00" }}>
        Fitness Analytics
      </h2>

      {/* Weight Progress */}
      <div
        style={{
          width: "600px",
          marginBottom: "50px",
          background: "#111",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 0 15px rgba(216,255,0,0.1)",
        }}
      >
        <h4 style={{ marginBottom: "20px" }}>Weight Progress</h4>
        {weightHistory.length > 0 ? (
          <Line data={weightData} options={chartOptions} />
        ) : (
          <p>No weight data available</p>
        )}
      </div>

      {/* Last 7 Days Calories */}
      <div
        style={{
          width: "600px",
          marginBottom: "50px",
          background: "#111",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 0 15px rgba(216,255,0,0.1)",
        }}
      >
        <h4 style={{ marginBottom: "20px" }}>Last 7 Days Calories</h4>
        {last7.length > 0 ? (
          <Bar data={calorieData} options={chartOptions} />
        ) : (
          <p>No calorie logs available</p>
        )}
      </div>

      {/* Today's Macros */}
      <div
        style={{
          width: "400px",
          background: "#111",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 0 15px rgba(216,255,0,0.1)",
        }}
      >
        <h4 style={{ marginBottom: "20px" }}>Today's Macros</h4>
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