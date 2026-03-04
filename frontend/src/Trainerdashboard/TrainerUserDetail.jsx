import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const TrainerUserDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get(
        `http://localhost:4000/api/users/user/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUser(res.data.user);
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h2>{user.name}</h2>

      <p>Age: {user.age}</p>
      <p>Height: {user.height} cm</p>
      <p>Weight: {user.weight} kg</p>
      <p>Target Weight: {user.targetWeight}</p>
      <p>Goal: {user.goal}</p>
      <p>Activity Level: {user.activityLevel}</p>
      <p>Exercise Frequency: {user.frequency}</p>
      <p>Fitness Level: {user.fitnesslevel}</p>
    </div>
  );
};

export default TrainerUserDetail;