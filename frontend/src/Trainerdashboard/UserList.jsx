import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TrainerNavbar from "./Trainernavbar";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/api/users/users-with-payment",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  return (<>
  <TrainerNavbar></TrainerNavbar>
    <div style={{ padding: "20px" }}>
      <h2>All Gym Users</h2>

      {users.map((item) => (
        <div
          key={item.user._id}
          style={{
            border: "1px solid gray",
            padding: "15px",
            marginBottom: "10px",
          }}
        >
          <h3>{item.user.name}</h3>
          <p>Goal: {item.user.goal}</p>
          <p>Status: {item.membershipStatus}</p>

          <button
            onClick={() => navigate(`/trainer/user/${item.user._id}`)}
            style={{ marginRight: "10px" }}
          >
            View Detail
          </button>

          <button
  onClick={() =>
    navigate(`/trainer/user/${item.user._id}/calories`, {
      state: { username: item.user.name }
    })
  }
>
  View Calories
</button>
        </div>
      ))}
    </div>
    </>
  );
};

export default UserList;