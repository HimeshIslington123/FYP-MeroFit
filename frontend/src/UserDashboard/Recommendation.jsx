import React, { useEffect, useState } from "react";
import axios from "axios";

const Recommendation = () => {
  const [data, setData] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/recommendation", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, []);

  if (!data) return <h2 className="text-center mt-10">Loading...</h2>;

  return (
    <div className="max-w-4xl mx-auto p-8 text-white">
      <h1 className="text-3xl mb-6 font-bold text-center">
        🔥 Smart Diet Plan
      </h1>

      {/* TARGET */}
      <div className="mb-6 bg-white/10 p-4 rounded">
        <h2 className="text-xl mb-2">🎯 Targets</h2>
        <p>Calories: {data.targetCalories}</p>
        <p>Protein: {data.targetProtein} g</p>
        <p>Carb: {data.targetCarb} g</p>
        <p>Fat: {data.targetFat} g</p>
      </div>

      {/* TODAY */}
      <div className="mb-6 bg-white/10 p-4 rounded">
        <h2 className="mb-2">📅 Today</h2>
        <p>Calories: {data.todayCalories}</p>
        <p>Remaining Calories: {data.remainingCalories.toFixed(1)}</p>
        <p>Protein Left: {data.remainingProtein.toFixed(1)} g</p>
        <p>Carb Left: {data.remainingCarb.toFixed(1)} g</p>
        <p>Fat Left: {data.remainingFat.toFixed(1)} g</p>
      </div>

      {/* MESSAGE */}
      <div className="bg-green-600 p-3 mb-6 rounded text-center font-semibold">
        {data.message}
      </div>

      {/* FOODS */}
      <h2 className="text-2xl mb-4">🍎 Recommended Foods</h2>

      {data.recommendedFoods.length === 0 ? (
        <p className="text-red-400">
          No recommendations available for today.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {data.recommendedFoods.map((f) => (
            <div key={f._id} className="bg-white/10 p-4 rounded">
              <h3 className="font-bold">{f.name}</h3>
              <p>Calories: {f.calories}</p>
              <p>Protein: {f.protein} g</p>
              <p>Carb: {f.carb} g</p>
              <p>Fat: {f.fat} g</p>
              <p className="text-yellow-400 mt-2">
                ⭐ Score: {f.score}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recommendation;