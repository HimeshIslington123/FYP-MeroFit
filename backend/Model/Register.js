import mongoose from "mongoose";

const RegisterSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: Number,
  height: Number,
  weight: Number,
  gender: String,
  exerciseType: String,
  fitnesslevel: String,
  frequency: String,
  goal: String,
  activityLevel: String,
  targetWeight: Number,
  address: String,
  role: {
    type: String,
    enum: ["user", "trainer", "admin"],
    default: "user",
  },
  specialistTrainer: {
    type: String,
    enum: ["weight loss", "gain muscles", "stay fit"],
    default: "gain muscles",
  },
  certifications: [String],
  bio: { type: String, maxlength: 500 },
  image: { data: Buffer, contentType: String },
  createdAt: { type: Date, default: Date.now },
  calories: {
    type: Number,
    default: function () {
      if (!this.weight || !this.height || !this.age || !this.gender) return 0;

      let bmr;
      if (this.gender === "male") {
        bmr = 10 * this.weight + 6.25 * this.height - 5 * this.age + 5;
      } else {
        bmr = 10 * this.weight + 6.25 * this.height - 5 * this.age - 161;
      }

      let multiplier = 1.2;
      if (this.activityLevel === "moderate") multiplier = 1.55;
      else if (this.activityLevel === "active") multiplier = 1.725;
      else if (this.activityLevel === "very active") multiplier = 1.9;

      let tdee = bmr * multiplier;

      if (this.goal === "lose fat") tdee -= 400;
      else if (this.goal === "gain muscle") tdee += 300;

      return Math.round(tdee);
    },
  },
});

export const Register = mongoose.model("Register_fyp", RegisterSchema);
