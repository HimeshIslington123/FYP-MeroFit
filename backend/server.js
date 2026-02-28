
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import dotenv from "dotenv";
import { connectdb } from "./Config/Db.js";

import userRoutes from "./Routes/User.js";
import bodyRoutes from "./Routes/BodyProgress.js";
import exerciseRoutes from "./Routes/ExerciseController.js";
import blogRoutes from "./Routes/Blogcontroller.js"
import paymentRoutes from "./Routes/Esewa.js";
import caloriesRoutes from "./Routes/Calories.js";
import TrackCalories from "./Routes/TrackCalories.js";
import ExercisePr from "./Routes/ExercisePrController.js"
import WeightChanges from "./Routes/weightRoutes.js"
import chatRoutes from "./Routes/ChatController.js"
import ChatMessage from "./Model/Chat.js";
import PostRoutes from "./Routes/PostRoutes.js"
import RecommendationRoutes from "./Routes/Recommendation.js"


dotenv.config();

const app = express();
connectdb();

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("New socket connected:", socket.id);

  socket.on("registerUser", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log("Online users:", onlineUsers);
  });

  socket.on("sendMessage", async (data) => {
    try {
      const msg = await ChatMessage.create({
        senderId: data.senderId,
        receiverId: data.receiverId,
        message: data.message || "",
        image: data.file || null, 
      });

      const receiverSocket = onlineUsers.get(data.receiverId);
      if (receiverSocket) io.to(receiverSocket).emit("receiveMessage", msg);

      socket.emit("receiveMessage", msg);
    } catch (err) {
      console.error(err);
    }
  });

  socket.on("disconnect", () => {
    for (let [userId, sockId] of onlineUsers.entries()) {
      if (sockId === socket.id) onlineUsers.delete(userId);
    }
    console.log("User disconnected. Online users:", onlineUsers);
  });
});






















// Middleware
app.use(cors());
app.use(express.json());



// Example route
app.get("/", (req, res) => {
  res.send("Hello from backend!");
});

// Routes
app.use("/api/users", userRoutes);
app.use("/progress", bodyRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/blog",blogRoutes);
app.use("/esewa", paymentRoutes);
app.use("/calories", caloriesRoutes);
app.use("/TrackCalories", TrackCalories);
app.use("/api/pr", ExercisePr);
app.use("/api/weightchanges", WeightChanges);
app.use("/api/chat", chatRoutes);
app.use("/api/post",PostRoutes );
app.use("/api/recommendation",RecommendationRoutes );





const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running with Socket.IO on port ${PORT}`);
});
