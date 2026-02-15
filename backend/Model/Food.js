import mongoose from "mongoose";

const FoodSchema = new mongoose.Schema({
  name: { type: String, required: true },

  protein: { type: Number, required: true },
  carb: { type: Number, required: true },
  fat: { type: Number, required: true },

  calories: {
    type: Number,
    default: function () {
      return this.protein * 4 + this.carb * 4 + this.fat * 9;
    },
  },


  foodType: {
  type: String,
  enum: [
    "HIGH_PROTEIN",
    "LOW_CARB",
    "HIGH_CARB",
    "LOW_FAT",
    "BALANCED",
    "KETO",
  ],
  default: "BALANCED", 
},

});

const Food = mongoose.model("Foodtable", FoodSchema);

export default Food;
