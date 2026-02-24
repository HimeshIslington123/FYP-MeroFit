import express from "express";
import { authenticate } from "../Auth/Middleware.js";
import { Register } from "../Model/Register.js";
import { CalorieLog } from "../Model/Calories.js";
import Food from "../Model/Food.js";
import Exercise from "../Model/Exercise.js";

const router = express.Router();

router.get("/", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await Register.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const targetCalories = user.calories;
    const level = user.fitnesslevel;
    const freq = user.frequency;
    const goal = user.goal;

    // --- TODAY & YESTERDAY CALORIES
    const todayStr = new Date().toISOString().split("T")[0];
    const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    const todayLog = await CalorieLog.findOne({ userId, date: todayStr });
    const yesterdayLog = await CalorieLog.findOne({ userId, date: yesterdayStr });

    const todayCalories = todayLog ? todayLog.totalCalories : 0;
    const yesterdayCalories = yesterdayLog ? yesterdayLog.totalCalories : 0;

    // --- CALORIE STATUS & MESSAGES
    let calorieStatus = "normal";
    let message = "";

    if (todayCalories > targetCalories) {
      calorieStatus = "exceeded";
      message = "⚠ You exceeded today's calories. Focus on activity & cardio.";
    } else if (yesterdayCalories < targetCalories - 200) {
      calorieStatus = "under";
      message = "⚠ Yesterday was low intake. Prioritize strength & nutrition.";
    }

    // --- MUSCLE SPLIT LOGIC
    let muscleSplit = [];
    if (freq === "3 days") {
      if (level === "Beginner") muscleSplit = ["Full Body + Light Cardio","Upper + Core","Lower + Cardio"];
      else if (level === "Intermediate") muscleSplit = ["Push (Chest, Shoulders, Triceps)","Pull (Back, Biceps, Core)","Legs + Cardio"];
      else muscleSplit = ["Push","Pull","Legs + Core Finisher"];
    } else if (freq === "5 days") {
      if (level === "Beginner") muscleSplit = ["Upper","Lower","Core + Cardio","Upper","Lower"];
      else if (level === "Intermediate") muscleSplit = ["Push","Pull","Legs","Shoulders + Arms","Core + Cardio"];
      else muscleSplit = ["Push","Pull","Legs","Chest + Back","Arms + Core"];
    } else if (freq === "Everyday") {
      if (level === "Beginner") muscleSplit = ["Upper","Lower","Core","Cardio","Upper","Lower","Active Recovery"];
      else if (level === "Intermediate") muscleSplit = ["Push","Pull","Legs","Core","Chest","Back","Cardio"];
      else muscleSplit = ["Push","Pull","Legs","Chest","Back","Shoulders","Arms + Core"];
    }

    // --- FOOD RECOMMENDATION
    const foods = await Food.find();
    let recommendedFoods = [];

    if (calorieStatus !== "exceeded") {
      foods.forEach(f => {
        let score = 0;

        // Goal-based scoring
        if (goal === "lose fat") {
          if (f.foodType === "LOW_FAT") score += 3;
          if (f.protein >= 20) score += 2;
        } else if (goal === "gain muscle") {
          if (f.foodType === "HIGH_PROTEIN") score += 3;
          if (f.calories > 350) score += 2;
        } else {
          if (f.foodType === "BALANCED") score += 3;
        }

        // Calorie-based adjustment
        if (calorieStatus === "under" && f.calories > 350) score += 3;
        if (calorieStatus === "normal" && f.calories >= 250 && f.calories <= 400) score += 2;

        recommendedFoods.push({ ...f._doc, score });
      });

      recommendedFoods.sort((a,b) => b.score - a.score);
      recommendedFoods = recommendedFoods.slice(0, 5);
    }

    // --- EXERCISE RECOMMENDATION
    const exercises = await Exercise.find();
    let recommendedExercises = [];

    exercises.forEach(ex => {
      let score = 0;

      if (ex.level === level) score += 5;

      // Adjust by calorie status
      if (calorieStatus === "exceeded" && ex.targetMuscle === "Cardio") score += 6;
      if (calorieStatus === "under" && ex.targetMuscle !== "Cardio") score += 4;

      recommendedExercises.push({ ...ex._doc, score });
    });

    recommendedExercises.sort((a,b) => b.score - a.score);
    recommendedExercises = recommendedExercises.slice(0, 8);

    res.json({
      targetCalories,
      todayCalories,
      yesterdayCalories,
      calorieStatus,
      message,
      muscleSplit,
      recommendedFoods,
      recommendedExercises
    });

  } catch (error) {
    res.status(500).json({ message: "Recommendation error", error: error.message });
  }
});

export default router;