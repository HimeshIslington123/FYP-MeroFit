import express from "express";
import multer from "multer";
import { Post } from "../Model/Post.js";
import { Register } from "../Model/Register.js";
import { authenticate } from "../Auth/Middleware.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post(
  "/create",
  authenticate,
  upload.single("image"),
  async (req, res) => {
    try {
      const { caption } = req.body;

      const user = await Register.findById(req.user.id);
      if (!user) return res.status(404).json({ error: "User not found" });

      const post = new Post({
        user: user._id,
        caption: caption || "",
        image: req.file
          ? {
              data: req.file.buffer,
              contentType: req.file.mimetype,
            }
          : undefined,
      });

      await post.save();
      res.status(201).json(post);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

// GET: Count posts of logged-in user
router.get("/count", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    const count = await Post.countDocuments({ user: userId });

    res.json({ userId, postCount: count });
  } catch (err) {
    console.error("COUNT POSTS ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name image")
      .sort({ createdAt: -1 });

    const formatted = posts.map((p) => ({
      _id: p._id,
      caption: p.caption,
      createdAt: p.createdAt,

      image:
        p.image && p.image.data
          ? `data:${p.image.contentType};base64,${p.image.data.toString(
              "base64",
            )}`
          : null,

      user: {
        _id: p.user?._id,
        name: p.user?.name,

        image:
          p.user?.image && p.user.image.data
            ? `data:${p.user.image.contentType};base64,${p.user.image.data.toString(
                "base64",
              )}`
            : null,
      },
    }));

    res.json(formatted);
  } catch (err) {
    console.log("GET POSTS ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});


router.put("/:id", authenticate, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (post.user.toString() !== req.user.id)
      return res.status(403).json({ error: "Not allowed" });

    post.caption = req.body.caption || post.caption;
    await post.save();

    res.json({ message: "Post updated" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/:id", authenticate, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (post.user.toString() !== req.user.id)
      return res.status(403).json({ error: "Not allowed" });

    await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
