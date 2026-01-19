import express from "express";
const router=express.Router();


import  Food  from "../Model/Food.js"; 
import { authenticate } from "../Auth/Middleware.js";



// ✅ Get all foods
router.get("/", authenticate,async (req, res) => {
  try {
    const foods = await Food.find();
    res.status(200).json(foods);
  } catch (err) {
    res.status(500).json({ message: "Error fetching foods", error: err.message });
  }
});

// ✅ Get a single food by ID
router.get("/:id", async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: "Food not found" });
    res.status(200).json(food);
  } catch (err) {
    res.status(500).json({ message: "Error fetching food", error: err.message });
  }
});

// ✅ Add a new food
router.post("/", async (req, res) => {
  try {
    const { name, protein, carb, fat } = req.body;
    const food = new Food({ name, protein, carb, fat });
    await food.save();
    res.status(201).json({ message: "Food added", food });
  } catch (err) {
    res.status(500).json({ message: "Error adding food", error: err.message });
  }
});



// ✅ Update a food by ID
router.put("/:id", async (req, res) => {
  try {
    const { name, protein, carb, fat } = req.body;
    const updatedFood = await Food.findByIdAndUpdate(
      req.params.id,
      { name, protein, carb, fat },
      { new: true } // return updated document
    );
    if (!updatedFood) return res.status(404).json({ message: "Food not found" });
    res.status(200).json({ message: "Food updated", updatedFood });
  } catch (err) {
    res.status(500).json({ message: "Error updating food", error: err.message });
  }
});

// ✅ Delete a food by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedFood = await Food.findByIdAndDelete(req.params.id);
    if (!deletedFood) return res.status(404).json({ message: "Food not found" });
    res.status(200).json({ message: "Food deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting food", error: err.message });
  }
});

export default router;

