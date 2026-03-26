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

   
    const targetCalories = user.calories;


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


    const todayStr = new Date().toISOString().split("T")[0];

    const todayLog = await CalorieLog.findOne({
      userId,
      date: todayStr,
    });

    const todayCalories = todayLog?.totalCalories || 0;
    const todayProtein = todayLog?.totalProtein || 0;
    const todayCarb = todayLog?.totalCarb || 0;
    const todayFat = todayLog?.totalFat || 0;


    const remainingCalories = targetCalories - todayCalories;
    const remainingProtein = targetProtein - todayProtein;
    const remainingCarb = targetCarb - todayCarb;
    const remainingFat = targetFat - todayFat;


    let message = "";

    if (remainingCalories <= 0) {
      message = " Calories exceeded for today. No more food recommended.";
    } else if (remainingProtein <= 0) {
      message = "Protein completed. Focus on balanced carbs & fats.";
    } else if (remainingCalories < 200) {
      message = "Calories almost finished.";
    } else {
      message = "Balanced eating recommended.";
    }


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


    const foods = await Food.find();
    let recommendedFoods = [];

    foods.forEach((f) => {
      let score = 0;

      if (f.calories <= remainingCalories) {
        score += 40;
        score += (1 - f.calories / remainingCalories) * 20;
      } else {
        score -= (f.calories - remainingCalories) * 2;
      }


      if (remainingProtein > 0) {
        const usefulProtein = Math.min(f.protein, remainingProtein);
        score += usefulProtein * 4;
      } else {
        score -= f.protein * 3;
      }


      if (remainingFat > 0) {
        const usefulFat = Math.min(f.fat, remainingFat);
        score += usefulFat * 2;
      } else {
        score -= f.fat * 2;
      }


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


    recommendedFoods.sort((a, b) => b.score - a.score);
    recommendedFoods = recommendedFoods.slice(0, 20);

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





import Exercise from "../Model/Exercise.js";
import Paymentmodel from "../Model/GymPayment.js";

router.get("/exercise", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await Register.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const todayStr = new Date().toISOString().split("T")[0];
    const todayLog = await CalorieLog.findOne({
      userId,
      date: todayStr,
    });

    const todayCalories = todayLog?.totalCalories || 0;
    const targetCalories = user.calories || 2000;
    const remainingCalories = targetCalories - todayCalories;

    const exercises = await Exercise.find({
      level: user.fitnesslevel,
    });

    let scoredExercises = [];

    exercises.forEach((ex) => {
      let score = 0;

     
      if (ex.level === user.fitnesslevel) {
        score += 40;
      }

      if (user.goal === "lose fat") {
        if (ex.targetMuscle === "Cardio") score += 35;
        if (ex.targetMuscle === "Full Body") score += 20;
      }

      if (user.goal === "gain muscle") {
        if (["Chest", "Back", "Legs"].includes(ex.targetMuscle))
          score += 30;
        if (["Arms", "Shoulders"].includes(ex.targetMuscle))
          score += 20;
      }

      if (user.goal === "stay fit") {
        if (ex.targetMuscle === "Full Body") score += 30;
        if (ex.targetMuscle === "Core") score += 20;
      }

  
      if (user.frequency === "3 days") {
        if (["Chest", "Back", "Legs"].includes(ex.targetMuscle))
          score += 30;
      }

      if (user.frequency === "5 days") {
        if (
          ["Chest", "Back", "Legs", "Shoulders", "Arms"].includes(
            ex.targetMuscle
          )
        )
          score += 25;
      }

      if (user.frequency === "Everyday") {
        if (["Core", "Cardio"].includes(ex.targetMuscle))
          score += 20;
      }


      if (remainingCalories <= 0) {
        if (ex.targetMuscle === "Cardio") score += 50;
        else score -= 50;
      }

      if (remainingCalories > 0 && remainingCalories < 300) {
        if (ex.targetMuscle === "Cardio") score += 20;
        if (ex.targetMuscle === "Full Body") score += 10;
      }

      scoredExercises.push({
        ...ex._doc,
        score: Math.round(score),
      });
    });

    // Sort by score
    scoredExercises.sort((a, b) => b.score - a.score);

    // Take top 15
    const recommended = scoredExercises.slice(0, 15);

    res.json({
      remainingCalories,
      goal: user.goal,
      fitnessLevel: user.fitnesslevel,
      frequency: user.frequency,
      message:
        remainingCalories <= 0
          ? "Calories exceeded. Focus on cardio "
          : "Recommended workout for today ",
      recommendedExercises: recommended,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});





router.get("/admin/stats", authenticate, async (req, res) => {
  try {
    const totalUsers = await Register.countDocuments({ role: "user" });
    const totalTrainers = await Register.countDocuments({ role: "trainer" });

    const result = await Paymentmodel.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$payment_amount" }
        }
      }
    ]);

    const totalEarning = result.length > 0 ? result[0].total : 0;

    res.status(200).json({
      success: true,
      totalUsers,
      totalTrainers,
      totalEarning,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch admin stats",
      error: err.message,
    });
  }
});

export default router;