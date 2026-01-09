import mongoose from "mongoose";

const BodyProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Register_fyp",                  
    required: true,
  },
  title: { type: String, required: true },
  image: {
    data: Buffer,
    contentType: String,
  },
   createdAt: { type: Date, default: Date.now },
    
});

export const BodyProgress = mongoose.model("BodyProgressTable", BodyProgressSchema);
