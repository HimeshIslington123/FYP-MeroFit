import mongoose from "mongoose";
import express from "express";

import { CalorieLog } from "../models/CalorieLog.js";
import Food from "../models/Food.js";
import Exercise from "../models/Exercise.js";
import { Register } from "../Model/Register.js";
const router = express.Router();

export const getFullRecommendation = async (req, res) => {
  try {
    const { userId } = req.params;

    // ===============================
    // 1️⃣ GET USER
    // ===============================
    const user = await Register.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const targetCalories = user.calories;
    const weightDifference = user.targetWeight - user.weight;

    // ===============================
    // 2️⃣ GET TODAY OR RECENT CALORIES
    // ===============================
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    let todayLog = await CalorieLog.findOne({ userId, date: todayStr });
    let todayCalories = 0;

    if (todayLog) {
      todayCalories = todayLog.totalCalories;
    } else {
      // No today data → check yesterday
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      todayLog = await CalorieLog.findOne({ userId, date: yesterdayStr });
      if (todayLog) {
        todayCalories = todayLog.totalCalories;
      } else {
        // No yesterday → use most recent log
        const recentLog = await CalorieLog.find({ userId })
          .sort({ date: -1 })
          .limit(1);
        if (recentLog.length > 0) todayCalories = recentLog[0].totalCalories;
      }
    }

    // ===============================
    // 3️⃣ GET LAST 7 DAYS AVERAGE
    // ===============================
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    const logs = await CalorieLog.find({
      userId,
      date: { $gte: sevenDaysAgo.toISOString().split("T")[0] },
    });

    let totalWeekCalories = 0;
    logs.forEach((log) => (totalWeekCalories += log.totalCalories));
    const averageWeekCalories = logs.length > 0 ? totalWeekCalories / logs.length : 0;

    const calorieDifference = todayCalories - targetCalories;
    const isNewUser = logs.length === 0;

    // ===============================
    // 4️⃣ FOOD RECOMMENDATION
    // ===============================
    const foods = await Food.find();
    let recommendedFoods = [];

    foods.forEach((food) => {
      let score = 0;

      // ---- Goal logic ----
      if (user.goal === "lose fat") {
        if (food.calories < 300) score += 5;
        if (food.fat < 10) score += 4;
        if (food.protein >= 15) score += 3;
      }
      if (user.goal === "gain muscle") {
        if (food.calories > 350) score += 5;
        if (food.protein >= 20) score += 6;
        if (food.carbs > 30) score += 3;
      }
      if (user.goal === "stay fit") {
        if (food.calories >= 250 && food.calories <= 400) score += 4;
        if (food.protein >= 15) score += 3;
      }

      // ---- Weight difference logic ----
      if (weightDifference < 0 && food.calories < 300) score += 4; // deficit
      if (weightDifference > 0 && food.calories > 350) score += 4; // surplus

      // ---- Calorie behavior (active users) ----
      if (!isNewUser) {
        if (user.goal === "gain muscle" && todayCalories < targetCalories) {
          if (food.calories > 400) score += 4;
        }
        if (user.goal === "lose fat" && todayCalories > targetCalories) {
          if (food.calories < 200) score += 4;
        }
        if (averageWeekCalories > targetCalories && food.calories < 250) score += 3;
        if (averageWeekCalories < targetCalories && food.calories > 350) score += 3;
      }

      // ---- Activity level ----
      if (user.activityLevel === "very active" && food.carbs > 30) score += 3;
      if (user.activityLevel === "very less" && food.calories < 300) score += 2;

      recommendedFoods.push({ ...food._doc, score });
    });

    recommendedFoods.sort((a, b) => b.score - a.score);
    recommendedFoods = recommendedFoods.slice(0, 5);

    // ===============================
    // 5️⃣ EXERCISE RECOMMENDATION
    // ===============================
    const exercises = await Exercise.find();
    let recommendedExercises = [];

    exercises.forEach((ex) => {
      let score = 0;

      // Fitness level
      if (ex.level === user.fitnesslevel) score += 5;
      if (user.fitnesslevel === "Beginner" && ex.level === "Advanced") score -= 5;

      // Goal logic
      if (user.goal === "lose fat" && (ex.targetMuscle === "Cardio" || ex.targetMuscle === "Full Body")) score += 6;
      if (user.goal === "gain muscle" && ex.targetMuscle !== "Cardio") score += 6;
      if (user.goal === "stay fit" && ex.targetMuscle === "Full Body") score += 5;

      // Weight difference
      if (weightDifference < 0 && ex.targetMuscle === "Cardio") score += 4;
      if (weightDifference > 0 && ex.targetMuscle !== "Cardio") score += 4;

      // Calorie behavior
      if (!isNewUser) {
        if (user.goal === "gain muscle" && todayCalories < targetCalories && ex.targetMuscle !== "Cardio") score += 4;
        if (user.goal === "lose fat" && todayCalories > targetCalories && ex.targetMuscle === "Cardio") score += 4;
      }

      // Activity level
      if (user.activityLevel === "very less" && ex.targetMuscle === "Full Body") score += 3;
      if (user.activityLevel === "very active" && ex.level === "Advanced") score += 3;

      // Frequency
      if (user.frequency === "Everyday" && ex.targetMuscle === "Cardio") score += 3;
      if (user.frequency === "3 days" && ex.targetMuscle !== "Cardio") score += 2;

      recommendedExercises.push({ ...ex._doc, score });
    });

    recommendedExercises.sort((a, b) => b.score - a.score);
    recommendedExercises = recommendedExercises.slice(0, 5);

    // ===============================
    // 6️⃣ FINAL RESPONSE
    // ===============================
    res.json({
      isNewUser,
      targetCalories,
      todayCalories,
      averageWeekCalories,
      calorieDifference,
      weightDifference,
      recommendedFoods,
      recommendedExercises,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Recommendation error" });
  }
};