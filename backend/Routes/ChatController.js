import express from "express";
import ChatMessage from "../Model/Chat.js";
import { authenticate } from "../Auth/Middleware.js";
import multer from "multer";

const router = express.Router();

router.get("/:userId/:otherId", authenticate, async (req, res) => {
  const { userId, otherId } = req.params;

  try {
    const messages = await ChatMessage.find({
      $or: [
        { senderId: userId, receiverId: otherId },
        { senderId: otherId, receiverId: userId },
      ],
    }).sort({ createdAt: 1 });

    const messagesWithFiles = messages.map(msg => {
      let file = null;
      if (msg.image && msg.image.data) {
        file = {
          name: msg.image.name,
          contentType: msg.image.contentType,
          data: msg.image.data.toString("base64"), 
        };
      }

      return {
        _id: msg._id,
        senderId: msg.senderId,
        receiverId: msg.receiverId,
        message: msg.message,
        file,
        createdAt: msg.createdAt,
        updatedAt: msg.updatedAt,
      };
    });

    res.json(messagesWithFiles);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/upload", authenticate, upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });


  const fileData = {
    data: req.file.buffer,
    contentType: req.file.mimetype,
    name: req.file.originalname,
  };

  res.json({ fileData });
});


export default router;
