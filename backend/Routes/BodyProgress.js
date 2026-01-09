import multer from "multer";
import express from "express";
import { authenticate } from "../Auth/Middleware.js";
import { BodyProgress } from "../Model/Bodyprogress.js";

const router = express.Router();
const uplaod = multer();

router.post(
  "/bodyprogress",
  authenticate,
  uplaod.single("image"),
  async (req, res) => {
    try {
      const id = req.user.id;
      const { title } = req.body;

      const Bodyprogress = new BodyProgress({
        user:id,
        title,
        image: { data: req.file.buffer, contentType: req.file.mimetype },
      });
      await Bodyprogress.save();

      res.status(200).json({ success: true, message: "Uploaded" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);


router.get("/getProgress", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all progress entries for this user
    const progresses = await BodyProgress.find({ user: userId });

    // Map each entry to include base64 image
    const data = progresses.map(p => ({
      id: p._id,
      title: p.title,
      createdAt: p.createdAt,
      image: `data:${p.image.contentType};base64,${p.image.data.toString("base64")}`
    }));

    res.json(data);
   

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
