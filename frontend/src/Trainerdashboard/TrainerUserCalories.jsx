import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Trainernavbar from "./Trainernavbar";

const TrainerUserCalories = () => {
  const { id } = useParams();
  const [logs, setLogs] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCalories();
  }, []);

  const fetchCalories = async () => {
    try {
      const res = await axios.get(
        `http://localhost:4000/TrackCalories/trainer/user/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setLogs(res.data.logs);
    } catch (err) {
      console.error(err);
    }
  };

  if (!logs.length) return <p>No calorie logs found</p>;

  return (<>
  <Trainernavbar></Trainernavbar>
    <div style={{ padding: "20px" }}>
      <h2>User Calorie History</h2>

      {logs.map((log) => (
        <div
          key={log._id}
          style={{
            border: "1px solid gray",
            padding: "15px",
            marginBottom: "10px",
          }}
        >
          <p>Date: {log.date}</p>
          <p>Total Calories: {log.totalCalories}</p>
          <p>Protein: {log.totalProtein} g</p>
          <p>Carb: {log.totalCarb} g</p>
          <p>Fat: {log.totalFat} g</p>
        </div>
      ))}
    </div>
    </>
  );
};

export default TrainerUserCalories;