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
  frequency: String,
  goal: String,
  activityLevel: String,
  targetWeight: Number,
  address: String,

  image: { data: Buffer, contentType: String },

  createdAt: { type: Date, default: Date.now },


  calories: {
    type: Number,
    default: function () {
      if (!this.weight || !this.height || !this.age || !this.gender) {
        return 0; 
      }

      let bmr;

    
      if (this.gender === "male") {
        bmr = 10 * this.weight + 6.25 * this.height - 5 * this.age + 5;
      } else {
        bmr = 10 * this.weight + 6.25 * this.height - 5 * this.age - 161;
      }

      // Default TDEE (moderately active)
      let tdee = bmr * 1.375;

      // Adjust based on goal
      if (this.goal === "lose fat") tdee -= 400;
      else if (this.goal === "gain muscle") tdee += 300;

      return Math.round(tdee);
    },
  },
});

export const Register = mongoose.model("Register_fyp", RegisterSchema);
