import express from "express";
import Exercise from "../Model/Exercise.js";
import { authenticate } from "../Auth/Middleware.js";

const router = express.Router();

/**
 * POST: Add single exercise
 */
router.post("/",authenticate, async (req, res) => {
  try {
    const exercise = await Exercise.create(req.body);
    res.status(201).json(exercise);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/",authenticate, async (req, res) => {
  try {
    const exercise = await Exercise.create(req.body);
     res.status(200).json(exercise);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
export default router;