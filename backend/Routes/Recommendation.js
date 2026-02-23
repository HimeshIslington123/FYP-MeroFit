import { Register } from "../models/Register.js";
import { CalorieLog } from "../models/CalorieLog.js";
import Food from "../models/Food.js";
import Exercise from "../models/Exercise.js";

export const getFullRecommendation = async (req, res) => {
  try {
    const { userId } = req.params;

    // ===============================
    // 1️⃣ GET USER
    // ===============================
    const user = await Register.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const targetCalories = user.calories;

    // ===============================
    // 2️⃣ GET TODAY CALORIES
    // ===============================
    const today = new Date().toISOString().split("T")[0];

    const todayLog = await CalorieLog.findOne({
      userId,
      date: today,
    });

    const todayCalories = todayLog ? todayLog.totalCalories : 0;

    // ===============================
    // 3️⃣ GET LAST 7 DAYS AVERAGE
    // ===============================
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const logs = await CalorieLog.find({
      userId,
      date: { $gte: sevenDaysAgo.toISOString().split("T")[0] },
    });

    let totalWeekCalories = 0;
    logs.forEach((log) => {
      totalWeekCalories += log.totalCalories;
    });

    const averageWeekCalories =
      logs.length > 0 ? totalWeekCalories / logs.length : 0;

    const calorieDifference = todayCalories - targetCalories;

    // ======================================================
    // 🍎 FOOD RECOMMENDATION
    // ======================================================

    const foods = await Food.find();
    let recommendedFoods = [];

    foods.forEach((food) => {
      let score = 0;

      // -------------------------------
      // 🎯 GOAL BASED LOGIC
      // -------------------------------

      // 🔥 LOSE FAT
      if (user.goal === "lose fat") {

        if (food.calories < 300) score += 5;
        if (food.fat < 10) score += 4;
        if (food.protein >= 15) score += 3;

        if (todayCalories > targetCalories) {
          if (food.calories < 200) score += 4;
        }
      }

      // 💪 GAIN MUSCLE
      if (user.goal === "gain muscle") {

        if (food.calories > 350) score += 5;
        if (food.protein >= 20) score += 6;
        if (food.carbs > 30) score += 3;

        if (todayCalories < targetCalories) {
          if (food.calories > 400) score += 4;
        }
      }

      // ⚖ STAY FIT
      if (user.goal === "stay fit") {

        if (food.calories >= 250 && food.calories <= 400) score += 4;
        if (food.protein >= 15) score += 3;
        if (food.fat < 15) score += 2;
      }

      // -------------------------------
      // 🏃 ACTIVITY LEVEL BONUS
      // -------------------------------
      if (user.activityLevel === "very active" && food.carbs > 30) {
        score += 3;
      }

      if (user.activityLevel === "very less" && food.calories < 300) {
        score += 2;
      }

      recommendedFoods.push({ ...food._doc, score });
    });

    recommendedFoods.sort((a, b) => b.score - a.score);
    recommendedFoods = recommendedFoods.slice(0, 5);

    // ======================================================
    // 🏋️ EXERCISE RECOMMENDATION
    // ======================================================

    const exercises = await Exercise.find();
    let recommendedExercises = [];

    exercises.forEach((ex) => {
      let score = 0;

      // -------------------------------
      // 🎯 FITNESS LEVEL
      // -------------------------------
      if (ex.level === user.fitnesslevel) score += 5;

      if (user.fitnesslevel === "Beginner" && ex.level === "Advanced") {
        score -= 5;
      }

      // -------------------------------
      // 🎯 GOAL LOGIC
      // -------------------------------

      if (user.goal === "lose fat") {

        if (ex.targetMuscle === "Cardio" || ex.targetMuscle === "Full Body")
          score += 6;

        if (todayCalories > targetCalories && ex.targetMuscle === "Cardio")
          score += 4;
      }

      if (user.goal === "gain muscle") {

        if (ex.targetMuscle !== "Cardio") score += 6;

        if (todayCalories < targetCalories && ex.targetMuscle !== "Cardio")
          score += 4;
      }

      if (user.goal === "stay fit") {

        if (ex.targetMuscle === "Full Body") score += 5;
      }

      // -------------------------------
      // 🏃 ACTIVITY LEVEL
      // -------------------------------
      if (user.activityLevel === "very less") {
        if (ex.targetMuscle === "Full Body") score += 3;
      }

      if (user.activityLevel === "very active") {
        if (ex.level === "Advanced") score += 3;
      }

      // -------------------------------
      // 📅 FREQUENCY
      // -------------------------------
      if (user.frequency === "Everyday") {
        if (ex.targetMuscle === "Cardio") score += 3;
      }

      if (user.frequency === "3 days") {
        if (ex.targetMuscle !== "Cardio") score += 2;
      }

      recommendedExercises.push({ ...ex._doc, score });
    });

    recommendedExercises.sort((a, b) => b.score - a.score);
    recommendedExercises = recommendedExercises.slice(0, 5);

    // ======================================================
    // FINAL RESPONSE
    // ======================================================

    res.json({
      targetCalories,
      todayCalories,
      averageWeekCalories,
      calorieDifference,
      recommendedFoods,
      recommendedExercises,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Recommendation error" });
  }
};