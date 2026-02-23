import React, { useEffect, useState } from "react";
import axios from "axios";
import badge1 from "../assets/badge1.png";
import badge2 from "../assets/badg2.png";
import badge3 from "../assets/badge3.png";
import badge4 from "../assets/badge4.png";
import badge5 from "../assets/badge5.png";
import badge6 from "../assets/badge6.png";
import badge7 from "../assets/badge7.png";
import badge8 from "../assets/badge8.png";
import badge9 from "../assets/badge9.png";
import { Award, Lock } from "lucide-react";

const Badge = () => {
  const [progressPhotos, setProgressPhotos] = useState([]);
  const [prs, setPrs] = useState([]);
  const [posts, setPosts] = useState([]);
  const [calorieLogs, setCalorieLogs] = useState([]);
  const [weightHistory, setWeightHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const token = localStorage.getItem("token");

        const [
          progressRes,
          prRes,
          postRes,
          calorieRes,
          weightRes,
        ] = await Promise.all([
          axios.get("http://localhost:4000/progress/getProgress", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:4000/api/pr", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:4000/api/post"),
          axios.get("http://localhost:4000/TrackCalories/all", {
            headers: { Authorization: `Bearer ${token}` },
          }).catch(() => ({ data: { logs: [] } })),
          axios.get(
            "http://localhost:4000/api/weightchanges/weight-history",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
        ]);

        setProgressPhotos(progressRes.data || []);
        setPrs(prRes.data || []);
        setPosts(postRes.data || []);
        setCalorieLogs(calorieRes.data.logs || []);
        setWeightHistory(weightRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (loading) return <div className="p-10 text-white">Loading...</div>;

  // ================= BADGE LIST =================
  const badgeList = [
    {
      id: 1,
      image: badge1,
      title: "First Workout Track",
      earned: prs.length >= 1,
      progress: `${prs.length}/1`,
    },
    {
      id: 2,
      image: badge2,
      title: "Weight Change Achieved",
      earned: weightHistory.length >= 2,
      progress: `${weightHistory.length}/2`,
    },
    {
      id: 3,
      image: badge3,
      title: "First Progress Log",
      earned: progressPhotos.length >= 1,
      progress: `${progressPhotos.length}/1`,
    },
    {
      id: 4,
      image: badge4,
      title: "5 Progress Photos",
      earned: progressPhotos.length >= 5,
      progress: `${progressPhotos.length}/5`,
    },
    {
      id: 5,
      image: badge5,
      title: "First Post",
      earned: posts.length >= 1,
      progress: `${posts.length}/1`,
    },
    {
      id: 6,
      image: badge6,
      title: "5 Posts Shared",
      earned: posts.length >= 5,
      progress: `${posts.length}/5`,
    },
    {
      id: 7,
      image: badge7,
      title: "First Calorie Track",
      earned: calorieLogs.length >= 1,
      progress: `${calorieLogs.length}/1`,
    },
    {
      id: 8,
      image: badge8,
      title: "Calorie Tracking Pro (10 Logs)",
      earned: calorieLogs.length >= 10,
      progress: `${calorieLogs.length}/10`,
    },
    {
      id: 9,
      image: badge9,
      title: "Workout Warrior (5 PRs)",
      earned: prs.length >= 5,
      progress: `${prs.length}/5`,
    },
  ];

  const earnedCount = badgeList.filter((b) => b.earned).length;
  const totalBadges = badgeList.length;
  const percentage = Math.round((earnedCount / totalBadges) * 100);

  return (
    <div className="bg-[#0f0f0f] text-white p-8 min-h-screen">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">
        <Award className="text-[#C7F045]" />
        <h1 className="text-3xl font-semibold">My Badges</h1>
      </div>

      {/* PROGRESS BAR */}
      <div className="mb-12">
        <p className="mb-3 text-lg">
          {earnedCount}/{totalBadges} badges earned
        </p>

        <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-3 bg-[#C7F045] transition-all duration-500"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>

        <p className="mt-2 text-sm text-gray-400">
          {percentage}% completed
        </p>
      </div>

      {/* BADGE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {badgeList.map((badge) => (
          <div
            key={badge.id}
            className={`rounded-2xl p-6 text-center transition-all duration-300
              ${
                badge.earned
                  ? "bg-[#1A1A1A] border border-[#C7F045] shadow-[0_0_30px_rgba(199,240,69,0.3)]"
                  : "bg-[#1A1A1A] border border-gray-700 opacity-60"
              }`}
          >
            <div className="flex justify-center mb-4">
              <img
                src={badge.image}
                alt={badge.title}
                className={`w-24 h-24 object-contain ${
                  !badge.earned ? "grayscale opacity-50" : ""
                }`}
              />
            </div>

            <h3 className="text-lg font-medium mb-4">
              {badge.title}
            </h3>

            {badge.earned ? (
              <div className="bg-[#C7F045] text-black py-2 px-4 rounded-full text-sm font-semibold">
                ✓ EARNED
              </div>
            ) : (
              <div className="bg-gray-800 text-gray-400 py-2 px-4 rounded-full text-sm flex items-center justify-center gap-2">
                <Lock size={14} />
                {badge.progress}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Badge;