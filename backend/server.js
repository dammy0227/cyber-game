// server.js
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

import connectDB from "./config/db.js";   // MongoDB connection
import authRoutes from "./routes/authRoutes.js"; 
import gameRoutes from "./routes/gameRoutes.js";

// Load environment variables
dotenv.config();

const app = express();

// ✅ Middleware
app.use(
  cors({
    origin: [
      "https://cyber-game-eight.vercel.app", // frontend deployed on Vercel
      "http://localhost:5173",               // local dev frontend (Vite)
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json()); // Parse JSON request body

// ✅ Connect Database
connectDB();

// ✅ API Routes
app.use("/api/auth", authRoutes);   // authentication endpoints
app.use("/api/game", gameRoutes);   // game-related endpoints

// ✅ Root route (for testing server is running)
app.get("/", (req, res) => {
  res.send("🎮 Cybersecurity Awareness Game API is running...");
});

// ✅ Error handling middleware (debugging helper)
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// ✅ Server listener
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
