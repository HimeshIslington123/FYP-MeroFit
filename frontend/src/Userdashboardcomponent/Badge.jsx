import React, { useEffect, useState } from "react";
import axios from "axios";
import { Award, CheckCircle2 } from "lucide-react";

import badge1 from "../assets/badge1.png";
import badge2 from "../assets/badg2.png";
import badge3 from "../assets/badge3.png";
import badge4 from "../assets/badge4.png";
import badge5 from "../assets/badge5.png";
import badge6 from "../assets/badge6.png";
import badge7 from "../assets/badge7.png";
import badge8 from "../assets/badge8.png";
import badge9 from "../assets/badge9.png";

const Badge = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    progressPhotos: [],
    prs: [],
    posts: [],
    calorieLogs: [],
    weightHistory: [],
  });

  const handleShareBadge = async (badge) => {
    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append(
        "caption",
        ` I just earned the "${badge.title}" badge!`,
      );


      const response = await fetch(badge.image);
      const blob = await response.blob();

      formData.append("image", blob, "badge.png");

      await axios.post("http://localhost:4000/api/post/create", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Badge shared successfully! ");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [progressRes, prRes, postRes, calorieRes, weightRes] =
          await Promise.all([
            axios.get("http://localhost:4000/progress/getProgress", {
              headers,
            }),
            axios.get("http://localhost:4000/api/pr", { headers }),
            axios.get("http://localhost:4000/api/post"),
            axios
              .get("http://localhost:4000/TrackCalories/all", { headers })
              .catch(() => ({ data: { logs: [] } })),
            axios.get(
              "http://localhost:4000/api/weightchanges/weight-history",
              { headers },
            ),
          ]);

        setData({
          progressPhotos: progressRes.data || [],
          prs: prRes.data || [],
          posts: postRes.data || [],
          calorieLogs: calorieRes.data.logs || [],
          weightHistory: weightRes.data || [],
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  


  const badgeList = [
    {
      id: 1,
      image: badge1,
      title: "First Workout Track",

      description: "Log your very first workout session.",
      earned: data.prs.length >= 1,
      progress: data.prs.length,
      target: 1,
    },
    {
      id: 2,
      image: badge2,
      title: "Weight Achiever",

      description: "Track your weight at least 2 times.",
      earned: data.weightHistory.length >= 2,
      progress: data.weightHistory.length,
      target: 2,
    },
    {
      id: 3,
      image: badge3,
      title: "First Progress Log",

      description: "Upload your first progress photo.",
      earned: data.progressPhotos.length >= 1,
      progress: data.progressPhotos.length,
      target: 1,
    },
    {
      id: 4,
      image: badge4,
      title: "Visual Journey",

      description: "Upload 5 progress photos to track transformation.",
      earned: data.progressPhotos.length >= 5,
      progress: data.progressPhotos.length,
      target: 5,
    },
    {
      id: 5,
      image: badge5,
      title: "Community Voice",

      description: "Create your first community post.",
      earned: data.posts.length >= 1,
      progress: data.posts.length,
      target: 1,
    },
    {
      id: 6,
      image: badge6,
      title: "Social Influencer",

      description: "Make 5 posts in the community.",
      earned: data.posts.length >= 5,
      progress: data.posts.length,
      target: 5,
    },
    {
      id: 7,
      image: badge7,
      title: "Nutrient Tracker",

      description: "Log calories for the first time.",
      earned: data.calorieLogs.length >= 1,
      progress: data.calorieLogs.length,
      target: 1,
    },
    {
      id: 8,
      image: badge8,
      title: "Calorie Tracking Pro",

      description: "Track calories 10 times consistently.",
      earned: data.calorieLogs.length >= 10,
      progress: data.calorieLogs.length,
      target: 10,
    },
    {
      id: 9,
      image: badge9,
      title: "Workout Warrior",

      description: "Track 5 workout sessions.",
      earned: data.prs.length >= 5,
      progress: data.prs.length,
      target: 5,
    },
  ];

  const earnedCount = badgeList.filter((b) => b.earned).length;
  const percentage = Math.round((earnedCount / badgeList.length) * 100);

  return (
    <div className=" ">
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Award className="text-[#2bb3a3]" size={32} />
              <h1 className="text-2xl">Achievements</h1>
            </div>
            <p className="text-gray-500 text-lg">
              Stay consistent and unlock exclusive badges.
            </p>
          </div>

  
          <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex w-[300px] justify-between items-center mb-3">
              <span className="text-slate-800 font-medium">
                {earnedCount} of {badgeList.length} Earned
              </span>
              <span className="text-[#2bb3a3] m-[10px] font-bold">
                {percentage}%
              </span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#2bb3a3] rounded-full transition-all duration-700"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {badgeList.map((badge) => (
            <div
              key={badge.id}
              className={`bg-white rounded-[2rem] p-8 flex flex-col items-center text-center transition-all duration-300 border
              ${
                badge.earned
                  ? "border-orange-100 shadow-md hover:shadow-xl"
                  : "border-gray-100 opacity-60"
              }`}
            >
     
              <div className="mb-6 h-24 flex items-center justify-center">
                <img
                  src={badge.image}
                  alt={badge.title}
                  className={`w-20 h-20 object-contain ${
                    !badge.earned ? "grayscale opacity-40" : ""
                  }`}
                />
              </div>

              <h3 className="text-xl  text-gray-800 mb-1">{badge.title}</h3>

              <p className="text-gray-500 text-sm mb-6">{badge.description}</p>


              <div className="mt-auto">
                {badge.earned ? (
                  <div className="flex flex-col gap-2 items-center">
                    <div className="flex items-center gap-2 text-[#2bb3a3]">
                      <CheckCircle2 size={18} />
                      <span>Earned</span>
                    </div>

                    <button
                      onClick={() => handleShareBadge(badge)}
                      className="text-sm text-white bg-[#e67e22] px-4 py-1 rounded-2xl hover:bg-[#e67e22]/90"
                    >
                      Share to Community
                    </button>
                  </div>
                ) : (
                  <div className="text-gray-400 ">
                    {badge.progress} / {badge.target}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Badge;
