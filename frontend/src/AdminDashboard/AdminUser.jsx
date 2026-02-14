import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../AdminDashboardComponent/Navbar";

const AdminUser = () => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");

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

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(
        `http://localhost:4000/api/users/delete/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const statusBadge = (status) => {
    const base = {
      padding: "6px 12px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "600",
    };

    if (status === "ACTIVE")
      return <span style={{ ...base, background: "#e6f9f0", color: "#0f9d58" }}>ACTIVE</span>;

    if (status === "EXPIRED")
      return <span style={{ ...base, background: "#fdeaea", color: "#d93025" }}>EXPIRED</span>;

    return <span style={{ ...base, background: "#f1f3f4", color: "#5f6368" }}>NO PAYMENT</span>;
  };

  return (
    <div style={{ background: "#f5f7fb", minHeight: "100vh" }}>
      <Navbar />

      <div style={{ padding: "30px" }}>
        <h2 style={{ marginBottom: "20px", fontWeight: "600" }}>
           Gym Members
        </h2>

        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
            overflow: "hidden",
          }}
        >
          <table width="100%" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb", textAlign: "left" }}>
                <th style={th}>Name</th>
                <th style={th}>Email</th>
                <th style={th}>Goal</th>
                <th style={th}>Payment</th>
                <th style={th}>Expiry</th>
                <th style={th}>Status</th>
                <th style={th}>Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((item) => (
                <tr key={item.user._id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={td}>
                    <strong>{item.user.name}</strong>
                  </td>

                  <td style={{ ...td, color: "#555" }}>
                    {item.user.email}
                  </td>

                  <td style={td}>{item.user.goal}</td>

                  <td style={td}>
                    {item.payment ? `Rs ${item.payment.payment_amount}` : "—"}
                  </td>

                  <td style={td}>
                    {item.payment
                      ? new Date(item.payment.expire_at).toLocaleDateString()
                      : "—"}
                  </td>

                  <td style={td}>{statusBadge(item.membershipStatus)}</td>

                  <td style={td}>
                    <button
                      onClick={() => deleteUser(item.user._id)}
                      style={{
                        background: "#fee",
                        color: "#d93025",
                        border: "none",
                        padding: "8px 14px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "600",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const th = {
  padding: "16px",
  fontSize: "14px",
  fontWeight: "600",
  color: "#555",
};

const td = {
  padding: "16px",
  fontSize: "14px",
};

export default AdminUser;
