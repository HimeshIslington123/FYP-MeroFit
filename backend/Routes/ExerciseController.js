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

/**
 * POST: Bulk insert (200–300 exercises)
 */
router.post("/bulk", async (req, res) => {
  try {
    const exercises = await Exercise.insertMany(req.body);
    res.status(201).json(exercises);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * GET: Fetch exercises
 */
router.get("/",authenticate, async (req, res) => {
  const { muscle, level } = req.query;

  const filter = {};
  if (muscle) filter.targetMuscle = muscle;
  if (level) filter.level = level;

  const exercises = await Exercise.find(filter);
  res.json(exercises);
});

export default router;
