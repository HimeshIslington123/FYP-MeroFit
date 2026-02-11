import express from "express";
import multer from "multer";
import Blog from "../Model/Blog.js";
import { authenticate } from "../Auth/Middleware.js";

const router = express.Router();
const upload = multer(); // memory storage



router.get("/blog/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json({
      _id: blog._id,
      title: blog.title,
      author: blog.author,
      date: blog.date,
      description: blog.description,
      image: blog.image?.data
        ? `data:${blog.image.contentType};base64,${blog.image.data.toString("base64")}`
        : null,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


/**
 * CREATE BLOG
 */
router.post("/blog", upload.single("image"), async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file); // 🔍 DEBUG

    const { title, author, date, description } = req.body;

    const blog = new Blog({
      title,
      author,
      date,
      description,
      image: req.file
        ? {
            data: req.file.buffer,
            contentType: req.file.mimetype,
          }
        : undefined,
    });

    await blog.save();
    res.status(201).json({ success: true, message: "Blog created" });
  } catch (error) {
    console.error("BLOG CREATE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * GET ALL BLOGS
 */
router.get("/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });

    const data = blogs.map((b) => ({
      _id: b._id,
      title: b.title,
      author: b.author,
      date: b.date,
      description: b.description,
      createdAt: b.createdAt,
      image: b.image?.data
        ? `data:${b.image.contentType};base64,${b.image.data.toString("base64")}`
        : null,
    }));

    res.json(data);
  } catch (error) {
    console.error("GET BLOG ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * UPDATE BLOG
 */
router.put("/blog/:id", upload.single("image"), async (req, res) => {
  try {
    const { title, author, date, description } = req.body;

    const updateData = { title, author, date, description };

    if (req.file) {
      updateData.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    await Blog.findByIdAndUpdate(req.params.id, updateData);
    res.json({ success: true, message: "Blog updated" });
  } catch (error) {
    console.error("UPDATE BLOG ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * DELETE BLOG
 */
router.delete("/blog/:id", async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Blog deleted" });
  } catch (error) {
    console.error("DELETE BLOG ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
