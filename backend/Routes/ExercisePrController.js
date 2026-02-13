// routes/pr.js
import express from "express";
import ExercisePR from "../Model/ExercisePR.js";
import { authenticate } from "../Auth/Middleware.js";


const router = express.Router();

// GET all PRs of a user
router.get("/", authenticate, async (req, res) => {
  try {
    const prs = await ExercisePR.find({ userId: req.user.id }).populate("exerciseId");
    res.json(prs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add new PR for an exercise
router.post("/add", authenticate, async (req, res) => {
  try {
    const { exerciseId, weight, reps } = req.body;
    console.log("Adding PR:", { userId: req.user.id, exerciseId, weight, reps });

    if (!exerciseId || !weight || !reps) {
      return res.status(400).json({ error: "Missing fields" });
    }

    let pr = await ExercisePR.findOne({ userId: req.user.id, exerciseId });

    if (!pr) {
      pr = new ExercisePR({
        userId: req.user.id,
        exerciseId,
        logs: [{ weight, reps, date: new Date() }],
      });
    } else {
      pr.logs.push({ weight, reps, date: new Date() });
    }

    await pr.save();
    res.json(pr);
  } catch (err) {
    console.error("Error in /add PR:", err);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});


export default router;
