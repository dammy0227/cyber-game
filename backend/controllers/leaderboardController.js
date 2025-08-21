import User from "../models/User.js";

// 📌 Get Top 10 Players Leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    const players = await User.find()
      .select("username score level") // only safe fields
      .sort({ score: -1, level: -1 }) // highest score first
      .limit(10);

    res.json({ leaderboard: players });
  } catch (err) {
    console.error("Leaderboard error:", err);
    res.status(500).json({ message: "Failed to fetch leaderboard" });
  }
};
