import React, { useEffect, useState } from "react";
import axios from "axios";

const ExerciseRecommendation = () => {
  const [data, setData] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/recommendation/exercise", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, []);

  if (!data) return <h2 className="text-center mt-10">Loading...</h2>;

  return (
    <div className="max-w-5xl mx-auto p-8 text-white">
      <h1 className="text-3xl mb-6 font-bold text-center">
        Smart Workout Plan
      </h1>

      {/* USER INFO */}
      <div className="mb-6 bg-white/10 p-4 rounded">
        <h2 className="text-xl mb-2"> Your Profile</h2>
        <p>Goal: {data.goal}</p>
        <p>Fitness Level: {data.fitnessLevel}</p>
        <p>Frequency: {data.frequency}</p>
        <p>Remaining Calories: {data.remainingCalories}</p>
      </div>

      {/* MESSAGE */}
      <div
        className={`p-3 mb-6 rounded text-center font-semibold ${
          data.remainingCalories <= 0
            ? "bg-red-600"
            : "bg-green-600"
        }`}
      >
        {data.message}
      </div>

      {/* WORKOUT TYPE */}
      <h2 className="text-2xl mb-4">
        Recommended Exercises
      </h2>

      {data.recommendedExercises.length === 0 ? (
        <p className="text-red-400">
          No workout recommendations available today.
        </p>
      ) : (
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-4">
          {data.recommendedExercises.map((ex) => (
            <div key={ex._id} className="bg-white/10 p-4 rounded">
              <h3 className="font-bold text-lg">{ex.name}</h3>
              <p>Target: {ex.targetMuscle}</p>
              <p>Level: {ex.level}</p>

            {/*   <p className="text-yellow-400 mt-2 font-semibold">
                ⭐ Score: {ex.score}
              </p> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExerciseRecommendation;