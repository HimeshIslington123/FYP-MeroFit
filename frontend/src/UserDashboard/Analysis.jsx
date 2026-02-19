import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

const Analysis = () => {
  // Bar chart data
  const barData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Orders",
        data: [12, 19, 7, 15, 22, 30, 25],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  // Line chart data
  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Revenue",
        data: [500, 800, 650, 900, 1200, 1500],
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
      },
    ],
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Analytics Dashboard</h2>

      <div style={{ width: "600px", marginBottom: "40px" }}>
        <h4>Weekly Orders</h4>
        <Bar data={barData} />
      </div>

      <div style={{ width: "600px" }}>
        <h4>Monthly Revenue</h4>
        <Line data={lineData} />
      </div>
    </div>
  );
};

export default Analysis;
