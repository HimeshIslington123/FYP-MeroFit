import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../AdminDashboardComponent/Navbar";

const AdminFoods = () => {
  const token = localStorage.getItem("token");

  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    protein: "",
    carb: "",
    fat: "",
    mealType: "BREAKFAST",
  });


  const fetchFoods = async () => {
    try {
      const res = await axios.get("http://localhost:4000/calories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFoods(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);


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
        mealType: "BREAKFAST",
      });

      setEditingId(null);
      setShowForm(false);
      fetchFoods();
    } catch (err) {
      console.error(err);
    }
  };


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
    setForm({
      name: food.name,
      protein: food.protein,
      carb: food.carb,
      fat: food.fat,
      mealType: food.mealType,
    });
    setShowForm(true);
  };


  const filteredFoods = foods.filter((food) =>
    food.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ background: "#f5f7fb", minHeight: "100vh" }}>
      <Navbar />

      <div style={{ padding: "30px" }}>
        {/* HEADER */}
        <div style={headerRow}>
          <h2>Food Management</h2>

          <div style={{ display: "flex", gap: "10px" }}>
            <input
              placeholder="Search food..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={searchInput}
            />

            <button
              onClick={() => {
                setShowForm(!showForm);
                setEditingId(null);
              }}
              style={addBtn}
            >
              + Add Food
            </button>
          </div>
        </div>

        {/* FORM */}
        {showForm && (
          <div style={card}>
            <h3>{editingId ? "Edit Food" : "Add Food"}</h3>

            <form onSubmit={handleSubmit} style={formGrid}>
              <input
                placeholder="Name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                required
              />

              <input
                type="number"
                placeholder="Protein"
                value={form.protein}
                onChange={(e) =>
                  setForm({ ...form, protein: e.target.value })
                }
                required
              />

              <input
                type="number"
                placeholder="Carbs"
                value={form.carb}
                onChange={(e) =>
                  setForm({ ...form, carb: e.target.value })
                }
                required
              />

              <input
                type="number"
                placeholder="Fat"
                value={form.fat}
                onChange={(e) =>
                  setForm({ ...form, fat: e.target.value })
                }
                required
              />

    
              <select
                value={form.mealType}
                onChange={(e) =>
                  setForm({ ...form, mealType: e.target.value })
                }
              >
                <option value="BREAKFAST">Breakfast</option>
                <option value="LUNCH">Lunch</option>
                <option value="DINNER">Dinner</option>
                <option value="SNACK">Snack</option>
                <option value="POST_WORKOUT">Post Workout</option>
              </select>

              <button type="submit" style={saveBtn}>
                {editingId ? "Update" : "Save"}
              </button>
            </form>
          </div>
        )}


        <div style={card}>
          <table width="100%" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={th}>Name</th>
                <th style={th}>Protein</th>
                <th style={th}>Carb</th>
                <th style={th}>Fat</th>
                <th style={th}>Calories</th>
                <th style={th}>Meal Type</th>
                <th style={th}>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredFoods.map((food) => (
                <tr key={food._id}>
                  <td style={td}>{food.name}</td>
                  <td style={td}>{food.protein}</td>
                  <td style={td}>{food.carb}</td>
                  <td style={td}>{food.fat}</td>
                  <td style={td}>{food.calories}</td>
                  <td style={td}>{food.mealType}</td>

                  <td style={td}>
                    <button
                      onClick={() => editFood(food)}
                      style={editBtn}
                    >
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

              {filteredFoods.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    No foods found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};























const headerRow = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "20px",
};

const card = {
  background: "#fff",
  padding: "20px",
  borderRadius: "12px",
  marginBottom: "20px",
};

const formGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "10px",
};

const th = {
  padding: "12px",
  textAlign: "left",
  background: "#f5f5f5",
};

const td = {
  padding: "12px",
};

const searchInput = {
  padding: "8px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const addBtn = {
  background: "#2bb3a3",
  color: "white",
  padding: "8px 12px",
  border: "none",
  borderRadius: "6px",
};

const saveBtn = {
  background: "#2bb3a3",
  color: "white",
  padding: "10px",
  border: "none",
  borderRadius: "6px",
};

const editBtn = {
  background: "#2196f3",
  color: "white",
  padding: "6px 10px",
  border: "none",
  marginRight: "5px",
  borderRadius: "5px",
};

const deleteBtn = {
  background: "#f44336",
  color: "white",
  padding: "6px 10px",
  border: "none",
  borderRadius: "5px",
};

export default AdminFoods;