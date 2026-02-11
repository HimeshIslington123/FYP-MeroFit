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

dotenv.config();

const app = express();
connectdb();

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

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



const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running with Socket.IO on port ${PORT}`);
});
