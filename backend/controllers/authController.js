import User from "../models/User.js";
import GameSession from "../models/GameSession.js"; // ✅ needed for getMe
import jwt from "jsonwebtoken";

// 🔑 Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// 📌 Register
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user (password gets hashed via User model pre-save hook)
    const user = new User({ username, email, password });
    await user.save();

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error("registerUser error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 📌 Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error("loginUser error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 📌 Get current user + latest game state
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const session = await GameSession.findOne({ user: req.user.id })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        score: user.score,
        level: user.level,
        badges: user.badges,
        game: session
          ? {
              sessionId: session._id,
              level: session.level,
              stage: session.stage,
              colors: session.colors,
              lives: session.lives,
              goal: session.goal,
              safeClicks: session.safeClicks,
            }
          : null,
      },
    });
  } catch (err) {
    console.error("getMe error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
