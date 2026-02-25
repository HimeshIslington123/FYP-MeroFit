import express from "express";
import { authenticate } from "../Auth/Middleware.js";
import { Register } from "../Model/Register.js";
import { CalorieLog } from "../Model/Calories.js";
import Food from "../Model/Food.js";

const router = express.Router();

router.get("/", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await Register.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ================= CALORIES =================
    const targetCalories = user.calories;

    // ================= MACROS =================
    let proteinPercent = 0.3;
    let carbPercent = 0.4;
    let fatPercent = 0.3;

    if (user.goal === "lose fat") {
      proteinPercent = 0.35;
      carbPercent = 0.35;
      fatPercent = 0.3;
    }

    if (user.goal === "gain muscle") {
      proteinPercent = 0.3;
      carbPercent = 0.5;
      fatPercent = 0.2;
    }

    const targetProtein = Math.round((targetCalories * proteinPercent) / 4);
    const targetCarb = Math.round((targetCalories * carbPercent) / 4);
    const targetFat = Math.round((targetCalories * fatPercent) / 9);

    // ================= TODAY LOG =================
    const todayStr = new Date().toISOString().split("T")[0];

    const todayLog = await CalorieLog.findOne({
      userId,
      date: todayStr,
    });

    const todayCalories = todayLog?.totalCalories || 0;
    const todayProtein = todayLog?.totalProtein || 0;
    const todayCarb = todayLog?.totalCarb || 0;
    const todayFat = todayLog?.totalFat || 0;

    // ================= REMAINING =================
    const remainingCalories = targetCalories - todayCalories;
    const remainingProtein = targetProtein - todayProtein;
    const remainingCarb = targetCarb - todayCarb;
    const remainingFat = targetFat - todayFat;

    // ================= MESSAGE =================
    let message = "";

    if (remainingCalories <= 0) {
      message = "🚫 Calories exceeded for today. No more food recommended.";
    } else if (remainingProtein <= 0) {
      message = "✅ Protein completed. Focus on balanced carbs & fats.";
    } else if (remainingCalories < 200) {
      message = "⚠ Calories almost finished.";
    } else {
      message = "🍽 Balanced eating recommended.";
    }

    // ================= HARD STOP =================
    if (remainingCalories <= 0) {
      return res.json({
        targetCalories,
        targetProtein,
        targetCarb,
        targetFat,
        todayCalories,
        remainingCalories,
        remainingProtein,
        remainingCarb,
        remainingFat,
        message,
        recommendedFoods: [],
      });
    }

    // ================= FOOD AI =================
    const foods = await Food.find();
    let recommendedFoods = [];

    foods.forEach((f) => {
      let score = 0;

      // ----- CALORIE FIT -----
      if (f.calories <= remainingCalories) {
        score += 40;
        score += (1 - f.calories / remainingCalories) * 20;
      } else {
        score -= (f.calories - remainingCalories) * 2;
      }

      // ----- PROTEIN -----
      if (remainingProtein > 0) {
        const usefulProtein = Math.min(f.protein, remainingProtein);
        score += usefulProtein * 4;
      } else {
        score -= f.protein * 3;
      }

      // ----- FAT -----
      if (remainingFat > 0) {
        const usefulFat = Math.min(f.fat, remainingFat);
        score += usefulFat * 2;
      } else {
        score -= f.fat * 2;
      }

      // ----- CARB -----
      if (remainingCarb > 0) {
        const usefulCarb = Math.min(f.carb, remainingCarb);
        score += usefulCarb * 1.5;
      } else {
        score -= f.carb * 2;
      }

      recommendedFoods.push({
        ...f._doc,
        score: Math.round(score),
      });
    });

    // SORT + TOP 10
    recommendedFoods.sort((a, b) => b.score - a.score);
    recommendedFoods = recommendedFoods.slice(0, 10);

    res.json({
      targetCalories,
      targetProtein,
      targetCarb,
      targetFat,
      todayCalories,
      remainingCalories,
      remainingProtein,
      remainingCarb,
      remainingFat,
      message,
      recommendedFoods,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;