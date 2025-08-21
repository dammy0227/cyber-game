// src/utils/api.js
import axios from "axios";

// Backend base URL (adjust when deployed)
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});


// Attach token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// ===== AUTH REQUESTS =====
export const registerUser = (formData) => API.post("/auth/register", formData);
export const loginUser = (formData) => API.post("/auth/login", formData);
export const getUserProfile = () => API.get("/auth/me");

// ===== GAME REQUESTS (with sessionId) =====
export const startGame = () => API.post("/game/start");

// FIXED: send `colorIndex` (not colorId)
export const makeMove = (sessionId, colorIndex) =>
  API.post("/game/move", { sessionId, colorIndex });

// FIXED: send sessionId directly (not object)
export const nextStage = (sessionId) =>
  API.post("/game/next-stage", { sessionId });

export const getLeaderboard = () => API.get("/game/leaderboard");


export const resumeGame = () => API.get("/game/resume");
