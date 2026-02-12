import mongoose from "mongoose";
import express from "express";
import Food from "../Model/Food.js";
import { authenticate } from "../Auth/Middleware.js";
import { CalorieLog } from "../Model/Calories.js";

const router =express.Router();
router.post("/add-food", authenticate, async (req, res) => {
  try {
    const { foodId, quantity = 1 } = req.body;
    const userId = req.user.id;

    const food = await Food.findById(foodId);
    if (!food) return res.status(404).json({ message: "Food not found" });

    const today = new Date().toISOString().split("T")[0];

    let log = await CalorieLog.findOne({ userId, date: today });

    const foodEntry = {
      foodId,
      quantity,
      calories: food.calories * quantity,
      protein: food.protein * quantity,
      carb: food.carb * quantity,
      fat: food.fat * quantity
    };

    if (!log) {
      log = new CalorieLog({
        userId,
        date: today,
        foods: [foodEntry],
        totalCalories: foodEntry.calories,
        totalProtein: foodEntry.protein,
        totalCarb: foodEntry.carb,
        totalFat: foodEntry.fat
      });

      await log.save();
      return res.status(201).json({ message: "Food added to new log", log });
    }

    // Update existing log
    log.foods.push(foodEntry);

    // increment totals
    log.totalCalories += foodEntry.calories;
    log.totalProtein += foodEntry.protein;
    log.totalCarb += foodEntry.carb;
    log.totalFat += foodEntry.fat;

    await log.save();
    return res.status(200).json({ message: "Food added", log });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});



router.get("/today", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().split("T")[0];

    // Find today's log
    const log = await CalorieLog.findOne({ userId, date: today }).populate("foods.foodId");

    if (!log) {
      return res.status(404).json({ message: "No log found for today" });
    }

    res.status(200).json({ log });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/all7days", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().split("T")[0];

    // Find today's log
    const log = await CalorieLog.find().populate("foods.foodId");

    if (!log) {
      return res.status(404).json({ message: "No log found for today" });
    }

    res.status(200).json({ log });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});



export default router;