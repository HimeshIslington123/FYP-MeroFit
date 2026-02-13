import mongoose from "mongoose";

const WeightHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Register_fyp",
    required: true,
  },

  weight: {
    type: Number,
    required: true,
  },

  recordedAt: {
    type: Date,
    default: Date.now,
  },
});

export const WeightHistory = mongoose.model(
  "WeightHistory",
  WeightHistorySchema
);
