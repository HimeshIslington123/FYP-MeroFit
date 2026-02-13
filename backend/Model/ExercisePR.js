// models/ExercisePR.js
import mongoose from "mongoose";

const exercisePRSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Register_fyp", required: true },
    exerciseId: { type: mongoose.Schema.Types.ObjectId, ref: "Exercise", required: true },
    logs: [
      {
        date: { type: Date, default: Date.now },
        weight: Number, // in kg
        reps: Number,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("ExercisePR", exercisePRSchema);
