import React, { useEffect, useState } from "react";
import axios from "axios";

const Recommendation = () => {
  const [data, setData] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(
        "http://localhost:4000/api/recommendation",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setData(res.data);
    };

    fetchData();
  }, [token]);

  if (!data) return <h2>Loading...</h2>;

  return (
    <div className="text-white" style={{ padding: 30, maxWidth: 1000, margin: "auto" }}>
      <h1>🔥 Smart Recommendation</h1>

      <h3>Target: {data.targetCalories}</h3>
      <h3>Today: {data.todayCalories}</h3>
      <h3>Yesterday: {data.yesterdayCalories}</h3>

      {data.message && (
        <div style={{ background: "#ffe0e0", padding: 15 }}>
          {data.message}
        </div>
      )}

      <h2>🏋️ Weekly Split Plan</h2>
      <ul>
        {data.muscleSplit.map((split, i) => (
          <li key={i}>{split}</li>
        ))}
      </ul>

      {data.calorieStatus !== "exceeded" && (
        <>
          <h2>🍎 Food</h2>
          {data.recommendedFoods.map((f) => (
            <div key={f._id}>
              <h4>{f.name}</h4>
              <p>{f.calories} kcal</p>
            </div>
          ))}
        </>
      )}

      <h2>💪 Exercises</h2>
      {data.recommendedExercises.map((ex) => (
        <div key={ex._id}>
          <h4>{ex.name}</h4>
          <p>{ex.targetMuscle}</p>
          <p>{ex.level}</p>
        </div>
      ))}
    </div>
  );
};

export default Recommendation;