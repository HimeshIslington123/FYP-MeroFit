import React, { useEffect, useState } from "react";
import axios from "axios";

const Recommendation = () => {
  const [data, setData] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("http://localhost:4000/api/recommendation", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data);
    };
    fetchData();
  }, [token]);

  if (!data) return <h2>Loading...</h2>;

  return (
    <div className="text-white" style={{ padding: 30, maxWidth: 900, margin: "auto" }}>
      <h1>🔥 Smart Diet & Exercise Plan</h1>

      <h3>Target Calories: {data.targetCalories}</h3>
      <h3>Today: {data.todayCalories}</h3>
      <h3>Yesterday: {data.yesterdayCalories}</h3>

      {data.message && <div style={{ background: "#ffe0e0", padding: 15 }}>{data.message}</div>}

      <h2>🏋️ Muscle Split / Gym Plan</h2>
      <ul>{data.muscleSplit.map((m,i)=><li key={i}>{m}</li>)}</ul>

      {data.calorieStatus !== "exceeded" && (
        <>
          <h2>🍎 Food Recommendations</h2>
          {data.recommendedFoods.map(f=>(
            <div key={f._id} style={{marginBottom:10, border:'1px solid #ddd', padding:10}}>
              <h4>{f.name}</h4>
              <p>Calories: {f.calories}</p>
              <p>Protein: {f.protein} | Carb: {f.carb} | Fat: {f.fat}</p>
              <p>Type: {f.foodType}</p>
            </div>
          ))}
        </>
      )}

      <h2>💪 Exercise Recommendations</h2>
      {data.recommendedExercises.map(ex=>(
        <div key={ex._id} style={{marginBottom:10, border:'1px solid #ddd', padding:10}}>
          <h4>{ex.name}</h4>
          <p>Target: {ex.targetMuscle}</p>
          <p>Level: {ex.level}</p>
        </div>
      ))}
    </div>
  )
};

export default Recommendation;