import mongoose from "mongoose";

const CalorieLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Register", required: true },


  date: {
    type: String,
    required: true,
  },

  foods: [
    {
      foodId: { type: mongoose.Schema.Types.ObjectId, ref: "Foodtable" },
      quantity: { type: Number, default: 1 },
      calories: Number,
      protein: Number,
      carb: Number,
      fat: Number,
    },
  ],

  totalCalories: { type: Number, default: 0 },
  totalProtein: { type: Number, default: 0 },
  totalCarb: { type: Number, default: 0 },
  totalFat: { type: Number, default: 0 }
});

export const CalorieLog = mongoose.model("CalorieLog", CalorieLogSchema);
