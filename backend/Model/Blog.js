import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    author: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: Date,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    image: {
      type: String, // store image URL or filename
      required: false,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
