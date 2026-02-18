import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../AdminDashboardComponent/Navbar";

const AdminFoods = () => {
  const token = localStorage.getItem("token");

  const [foods, setFoods] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    protein: "",
    carb: "",
    fat: "",
    foodType: "BALANCED",
  });

  /* ================= FETCH FOODS ================= */
  const fetchFoods = async () => {
    try {
      const res = await axios.get("http://localhost:4000/calories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFoods(res.data);
    } catch (err) {
      console.error("Error fetching foods:", err);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  /* ================= ADD / UPDATE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await axios.put(
          `http://localhost:4000/calories/${editingId}`,
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post("http://localhost:4000/calories", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setForm({
        name: "",
        protein: "",
        carb: "",
        fat: "",
        foodType: "BALANCED",
      });
      setEditingId(null);
      setShowForm(false);
      fetchFoods();
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= DELETE ================= */
  const deleteFood = async (id) => {
    if (!window.confirm("Delete this food?")) return;

    try {
      await axios.delete(`http://localhost:4000/calories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchFoods();
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= EDIT ================= */
  const editFood = (food) => {
    setEditingId(food._id);
    setForm(food);
    setShowForm(true);
  };

  return (
    <div style={{ background: "#f5f7fb", minHeight: "100vh" }}>
      <Navbar />

      <div style={{ padding: "30px" }}>
        <div style={headerRow}>
          <h2 style={{ fontWeight: "600" }}>Food Management</h2>

          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
            }}
            style={addBtn}
          >
            + Add New Food
          </button>
        </div>

        {/* ================= FORM ================= */}
        {showForm && (
          <div style={card}>
            <h3 style={{ marginBottom: "16px" }}>
              {editingId ? "Edit Food" : "Add New Food"}
            </h3>

            <form onSubmit={handleSubmit} style={formGrid}>
              <input
                placeholder="Food name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Protein (g)"
                value={form.protein}
                onChange={(e) => setForm({ ...form, protein: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Carbs (g)"
                value={form.carb}
                onChange={(e) => setForm({ ...form, carb: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Fat (g)"
                value={form.fat}
                onChange={(e) => setForm({ ...form, fat: e.target.value })}
                required
              />

              <select
                value={form.foodType}
                onChange={(e) =>
                  setForm({ ...form, foodType: e.target.value })
                }
              >
                <option value="BALANCED">Balanced</option>
                <option value="HIGH_PROTEIN">High Protein</option>
                <option value="LOW_CARB">Low Carb</option>
                <option value="HIGH_CARB">High Carb</option>
                <option value="LOW_FAT">Low Fat</option>
                <option value="KETO">Keto</option>
              </select>

              <button type="submit" style={saveBtn}>
                {editingId ? "Update Food" : "Save Food"}
              </button>
            </form>
          </div>
        )}

        {/* ================= TABLE ================= */}
        <div style={card}>
          <table width="100%" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb" }}>
                <th style={th}>Name</th>
                <th style={th}>Protein</th>
                <th style={th}>Carb</th>
                <th style={th}>Fat</th>
                <th style={th}>Calories</th>
                <th style={th}>Type</th>
                <th style={th}>Action</th>
              </tr>
            </thead>

            <tbody>
              {foods.map((food) => (
                <tr key={food._id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={td}><strong>{food.name}</strong></td>
                  <td style={td}>{food.protein}</td>
                  <td style={td}>{food.carb}</td>
                  <td style={td}>{food.fat}</td>
                  <td style={td}>{food.calories}</td>
                  <td style={td}>{food.foodType}</td>
                  <td style={td}>
                    <button onClick={() => editFood(food)} style={editBtn}>
                      Edit
                    </button>
                    <button
                      onClick={() => deleteFood(food._id)}
                      style={deleteBtn}
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

/* ================= STYLES ================= */

const headerRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
};

const card = {
  background: "#fff",
  borderRadius: "12px",
  padding: "20px",
  marginBottom: "25px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
};

const formGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "15px",
};

const th = {
  padding: "16px",
  fontSize: "14px",
  fontWeight: "600",
  color: "#555",
  textAlign: "left",
};

const td = {
  padding: "16px",
  fontSize: "14px",
};

const addBtn = {
  background: "#1a73e8",
  color: "#fff",
  border: "none",
  padding: "10px 16px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
};

const saveBtn = {
  background: "#1a73e8",
  color: "#fff",
  border: "none",
  padding: "12px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
};

const editBtn = {
  background: "#e8f0fe",
  color: "#1a73e8",
  border: "none",
  padding: "6px 12px",
  borderRadius: "6px",
  marginRight: "8px",
  cursor: "pointer",
  fontWeight: "600",
};

const deleteBtn = {
  background: "#fee",
  color: "#d93025",
  border: "none",
  padding: "6px 12px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "600",
};

export default AdminFoods;
