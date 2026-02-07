import express from "express";
import ChatMessage from "../Model/Chat.js";
import { authenticate } from "../Auth/Middleware.js";

const router = express.Router();

// Get all messages between two users
router.get("/:userId/:otherId", authenticate, async (req, res) => {
  const { userId, otherId } = req.params;

  try {
    const messages = await ChatMessage.find({
      $or: [
        { senderId: userId, receiverId: otherId },
        { senderId: otherId, receiverId: userId },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/:userI/:otherId", authenticate, async (req, res) => {
  const { userId, otherId } = req.params;

  try {
    const messages = await ChatMessage.find({
      $or: [
        { senderId: userId, receiverId: otherId },
        { senderId: otherId, receiverId: userId },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


export default router;
