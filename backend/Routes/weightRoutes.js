import express from "express";
import { authenticate } from "../Auth/Middleware.js";
import { Register } from "../Model/Register.js";
import { WeightHistory } from "../Model/WeightHistory.js";

const router = express.Router();

/**
 * POST /api/weightchanges/update-weight
 * ADD / UPDATE USER WEIGHT
 */
router.post("/update-weight", authenticate, async (req, res) => {


  try {
  

    const userId = req.user?.id;
    const { weight } = req.body;

    if (!userId) {
      console.log(" userId missing from token");
      return res.status(401).json({ message: "Unauthorized: userId missing" });
    }

    if (!weight || weight <= 0) {
      console.log(" invalid weight:", weight);
      return res.status(400).json({ message: "Valid weight is required" });
    }


    await WeightHistory.create({
      user: userId,
      weight,
      recordedAt: new Date(),
    });

    
    const user = await Register.findById(userId);

    if (!user) {
      console.log(" User not found in Register");
      return res.status(404).json({ message: "User not found" });
    }


    user.weight = weight;

    // force calories recalculation
    user.calories = undefined;

    await user.save();

    console.log(" Weight updated successfully");

    res.status(200).json({
      success: true,
      message: "Weight updated successfully",
      currentWeight: user.weight,
      calories: user.calories,
    });
  } catch (error) {
    console.error("ERROR in /update-weight:", error);
    res.status(500).json({
      message: "Server error while updating weight",
      error: error.message,
    });
  }
});

/**
 * GET /api/weightchanges/weight-history
 * GET ALL OLD WEIGHTS
 */
router.get("/weight-history", authenticate, async (req, res) => {


  try {


    const userId = req.user?.id;

    if (!userId) {
      console.log(" userId missing from token");
      return res.status(401).json({ message: "Unauthorized" });
    }


    const history = await WeightHistory.find({ user: userId }).sort({
      recordedAt: 1,
    });



    res.status(200).json(history);
  } catch (error) {

    res.status(500).json({
      message: "Server error while fetching history",
      error: error.message,
    });
  }
});

export default router;
