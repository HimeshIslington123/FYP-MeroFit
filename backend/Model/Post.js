import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "Register_fyp", required: true }, // reference to user
  caption: { type: String, trim: true },
  image: {
    data: Buffer,
    contentType: String,
  },
  createdAt: { type: Date, default: Date.now },
});

export const Post = mongoose.model("Post_fyp", PostSchema);
