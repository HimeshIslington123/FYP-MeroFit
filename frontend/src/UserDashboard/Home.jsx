import React, { useContext, useState, useEffect } from "react";
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
import { Line, Bar } from "react-chartjs-2";
import {
  TrendingUp,
  Flame,
  Activity,
  Target,
  Award,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Train,
} from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../GlobalContext/Userprovider";
import Food from "../Userdashboardcomponent/Food";
import Trainer from "../Userdashboardcomponent/Trainer";
import RecommendationPreview from "./Recommendation";
import TrackChanges from "./TrackChanges";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
);

const Homeuser = () => {
  const [weightHistory, setWeightHistory] = useState([]);
  const [calorieLogs, setCalorieLogs] = useState([]);
  const { user } = useContext(UserContext);
  const [value, setValues] = useState({ active: false });

  // Fetch user payment info
  useEffect(() => {
    const token = localStorage.getItem("token");
    const verify = async () => {
      const res = await axios.get(`http://localhost:4000/esewa/getPayment`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setValues(res.data);
    };
    verify();
  }, []);

  // Fetch weight and calorie analytics
  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchAnalytics = async () => {
      try {
        const [weightRes, calorieRes] = await Promise.all([
          axios.get("http://localhost:4000/api/weightchanges/weight-history", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:4000/TrackCalories/all", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setWeightHistory(weightRes.data || []);
        setCalorieLogs(calorieRes.data.logs || []);
      } catch (err) {
        console.error("Analytics error:", err);
      }
    };
    fetchAnalytics();
  }, []);

  if (!user) return <div className="text-white">Loading...</div>;

  // BMI & Body Fat calculations
  const calculateBMI = (weight, heightCm) => weight / (heightCm / 100) ** 2;
  const calculateBodyFat = (weight, heightCm, age, gender) => {
    const bmi = calculateBMI(weight, heightCm);
    return gender === "male"
      ? (1.2 * bmi + 0.23 * age - 16.2).toFixed(1)
      : (1.2 * bmi + 0.23 * age - 5.4).toFixed(1);
  };

  // Last two weight difference
  const lastTwoWeights = weightHistory.slice(-2);
  const weightDiff =
    lastTwoWeights.length === 2
      ? (lastTwoWeights[1].weight - lastTwoWeights[0].weight).toFixed(1)
      : null;

  // Prepare chart data
  const weightData = {
    labels: weightHistory.map((w) =>
      new Date(w.recordedAt).toLocaleDateString(),
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

  // Stats cards
  const stats = [
    {
      label: "Weight",
      value: user.weight,
      unit: "kg",
      icon: Activity,
      change: "-2.3%",
      isPositive: true,
    },
    {
      label: "Height",
      value: user.height,
      unit: "cm",
      icon: TrendingUp,
      change: "",
      isPositive: true,
    },
    {
      label: "Body Fat",
      value: calculateBodyFat(user.weight, user.height, user.age, user.gender),
      unit: "%",
      icon: Target,
      change: "-1.5%",
      isPositive: true,
    },
    {
      label: "Calories",
      value: user.calories,
      unit: "kcal",
      icon: Flame,
      change: "+12%",
      isPositive: true,
    },
    {
      label: "Progress",
      value: user.fitnesslevel,
      unit: "%",
      icon: Award,
      change: "+8%",
      isPositive: true,
    },
  ];

  return (
    <div className="w-full text-black">
      {/* Header */}
      <h4 className="text-[25px] font-semibold text-black">Hi, {user?.name}</h4>
      <h4 className="text-[15px] opacity-65 text-black">
        Here's your fitness snapshot for today, {new Date().toDateString()}
      </h4>

      {/* Stats Cards */}
      <div className="w-full flex flex-row flex-wrap mt-4 gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-5 w-full">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white p-8 border rounded-2xl border-gray-100 shadow-sm hover:shadow-md cursor-pointer group flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-[#2bb3a3]/30 rounded-xl group-hover:bg-[#2bb3a3]/10 transition-colors">
                    <Icon size={24} className="text-[#2bb3a3]" />
                  </div>
                  {stat.change && (
                    <span
                      className={`text-sm font-medium ${
                        stat.isPositive ? "text-[#2bb3a3]" : "text-[#FF3131]"
                      }`}
                    >
                      {stat.change}
                    </span>
                  )}
                </div>
                <h3 className="text-black text-3xl mb-1">
                  {stat.value}
                  <span className="text-gray-500 text-lg ml-1">
                    {stat.unit}
                  </span>
                </h3>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Weight Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-light text-black">Weight Progress</h3>
            {weightDiff && (
              <span className="flex items-center gap-1 bg-[#fdf3e7] text-[#e67e22] px-2 py-1 text-[12px] rounded-full">
                {/* Icon */}
                {weightDiff > 0 ? (
                  <ArrowUp size={14} className="text-[#e67e22]" />
                ) : (
                  <ArrowDown size={14} className="text-[#e67e22]" />
                )}
                {/* Weight text */}
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
                scales: {
                  x: { grid: { display: false } },
                  y: { grid: { display: false } },
                },
              }}
            />
          ) : (
            <p className="text-gray-400 text-sm">No weight data available</p>
          )}
        </div>

        {/* Calorie Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-light text-black">
              Last 7 Days Calories
            </h3>
            {last7.length > 0 && (
              <span className="bg-[#fdf3e7] text-[#e67e22] text-[12px] px-2 py-1 rounded-full">
                Avg{" "}
                {Math.round(
                  last7.reduce((sum, log) => sum + log.totalCalories, 0) /
                    last7.length,
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
                scales: {
                  x: { grid: { display: false } },
                  y: { grid: { display: false } },
                },
              }}
            />
          ) : (
            <p className="text-gray-400 text-sm">No calorie data available</p>
          )}
        </div>
      </div>
<Trainer data={value}></Trainer>

      {/* Recommended Foods */}
   {/*    <div className="mt-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Award size={18} className="text-[#C7F045]" />
          <h1 className="text-white/90 text-lg font-medium tracking-wide">
            Recommended Foods for You
          </h1>
        </div>
        <Link
          to="/userhome/foods"
          className="flex items-center gap-1 text-sm text-white/70 hover:text-[#C7F045] transition"
        >
          View More
          <ChevronRight size={16} />
        </Link>
      </div>
      <Food limit={8} showFilters={false} / */}
      <RecommendationPreview limit={4} />
    <TrackChanges></TrackChanges></div>
   

  );
};

export default Homeuser;
