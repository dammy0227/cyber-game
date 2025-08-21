import express from "express";
import { startGame, makeMove, nextStage, resumeGame } from "../controllers/gameController.js";
import { getLeaderboard } from "../controllers/leaderboardController.js";
import protect from "../middleware/auth.js";

const router = express.Router();

// 📌 Game play routes
router.post("/start", protect, startGame);
router.post("/move", protect, makeMove);
router.post("/next-stage", protect, nextStage);

// 📌 Leaderboard (public, no auth required)
router.get("/leaderboard", getLeaderboard);

router.get("/resume", protect, resumeGame);

export default router;
