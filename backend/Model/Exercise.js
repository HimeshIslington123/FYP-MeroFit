import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema(
  {
    exerciseId: {
      type: Number,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    targetMuscle: {
      type: String,
      required: true,
      enum: [
        "Chest",
        "Back",
        "Arms",
        "Shoulders",
        "Legs",
        "Core",
        "Full Body",
        "Cardio",
      ],
    },
    level: {
      type: String,
      required: true,
      enum: ["Beginner", "Intermediate", "Advanced"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Exercise", exerciseSchema);
