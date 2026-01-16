
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import { Register } from "../Model/Register.js"; // Your Mongoose model

import { authenticate } from "../Auth/Middleware.js";
import dotenv from "dotenv";
dotenv.config(); // Load env variables

const upload=multer();
const router = express.Router();

router.get("/", (req, res) => {
  res.send("User route working!");
});

router.get("/userdetail",authenticate, async (req, res) => {
  try {
    const id = req.user.userId || req.user.id; 
    const detail = await Register.findById(id);
    if (!detail) return res.status(404).json({ message: "User not found" });
   
const img = `data:${detail.image.contentType};base64,${detail.image.data.toString('base64')}`;

    res.json({data:detail,img:img});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post("/create", upload.single("image"), async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      age,
      height,
      weight,
      gender,
      exerciseType,
      frequency,
      goal,
      activityLevel,
      targetWeight,
      address,
    } = req.body;

    const existingUser = await Register.findOne({ email });
    if (existingUser)
      return res.status(400).json({ success: false, message: "User exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with image
    const user = new Register({
      name,
      email,
      password: hashedPassword,
      age,
      height,
      weight,
      gender,
      exerciseType,
      frequency,
      goal,
      activityLevel,
      targetWeight,
      address,
      image: req.file
        ? { data: req.file.buffer, contentType: req.file.mimetype }
        : null
    });

    await user.save();

    res.status(201).json({ success: true, message: "User registered", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error registering", error: err.message });
  }
});


// ✅ Get all users
router.get("/getusers",authenticate, async (req, res) => {
  try {
    const users = await Register.find().select("-password");;
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: err.message,
    });
  }
});


router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user
    const user = await Register.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      "myname",
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      user,
      token,
      id:user._id,
      
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
});



router.put("/updateProfile/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const {
      height,
      weight,
      target_weight,
      address,
      exercise_frequency,
      goal,
      activity_level
    } = req.body;

    // Map frontend fields → DB fields
    const updatedData = {
      height,
      weight,
      targetWeight: target_weight,
      address,
      frequency: exercise_frequency,
      goal,
      activityLevel: activity_level,
    };

    const updatedUser = await Register.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: error.message,
    });
  }
});

export default router;
