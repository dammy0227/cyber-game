// controllers/gameController.js
import GameSession from "../models/GameSession.js";
import User from "../models/User.js";
import { generateStageColors } from "../utils/randomizer.js";


// 🎯 Start a new game (or resume if active)
export const startGame = async (req, res) => {
  try {
    const userId = req.user._id;

    // If there's an unfinished session, return it instead of starting new
    let existing = await GameSession.findOne({ user: userId, isCompleted: false }).sort({ createdAt: -1 });
    if (existing) {
      return res.json(existing);
    }

    const level = 1;
    const stage = 1;
    const totalColors = 10;
    const phishingCount = 1;
    const goal = totalColors - phishingCount;

    const colors = generateStageColors(totalColors, phishingCount);

    const session = await GameSession.create({
      user: userId,
      level,
      stage,
      colors,
      lives: 3,
      safeClicks: 0,
      goal,
      isCompleted: false,
    });

    res.status(201).json(session);
  } catch (err) {
    console.error("startGame error:", err);
    res.status(500).json({ message: "Server error in startGame" });
  }
};


// 🎯 Make a move (when user clicks a color)
export const makeMove = async (req, res) => {
  try {
    const { sessionId, colorIndex } = req.body;
    const session = await GameSession.findById(sessionId);
    if (!session) return res.status(404).json({ message: "Session not found" });

    const colorObj = session.colors[colorIndex];
    if (!colorObj) return res.status(400).json({ message: "Invalid color index" });
    if (colorObj.clicked) {
      return res.json({ message: "Color already clicked", session });
    }

    // Mark clicked
    colorObj.clicked = true;
    let message = "";

    if (colorObj.isPhishing) {
      session.lives = Math.max(0, session.lives - 1);
      message =
        session.lives <= 0
          ? "💀 Game Over! All your lives are gone. Try again."
          : "⚠️ Phishing attempt detected! You lost 1 life.";
    } else {
      session.safeClicks += 1;
      message = "✅ Safe click!";

      // ✅ Stage complete
      if (session.safeClicks >= session.goal) {
        message = "🎉 Great job! Stage complete. Moving to the next stage…";

        // Update user score + badges
        const user = await User.findById(session.user);
        if (user) {
          user.score = (user.score || 0) + 10;
          user.level = Math.max(user.level || 1, session.level);

          if (!user.badges.includes("🥉 First Stage Clear")) {
            user.badges.push("🥉 First Stage Clear");
          }
          await user.save();
        }
      }
    }

    // Mark session over if lives run out
    if (session.lives <= 0) {
      session.isCompleted = true;
    }

    await session.save();
    return res.json({ message, session });
  } catch (err) {
    console.error("makeMove error:", err);
    res.status(500).json({ message: "Server error in makeMove" });
  }
};


// 🎯 Advance to next stage / level
// 🎯 Advance to next stage / level
// 🎯 Advance to next stage / level
export const nextStage = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await GameSession.findById(sessionId);
    if (!session) return res.status(404).json({ message: "Session not found" });

    let { level, stage } = session;

    // Ruleset for each level/stage
    const rules = {
      1: [
        { colors: 10, phishing: 1 },
        { colors: 7, phishing: 1 },
        { colors: 5, phishing: 1 },
      ],
      2: [
        { colors: 10, phishing: 2 },
        { colors: 7, phishing: 2 },
        { colors: 5, phishing: 2 },
      ],
      3: [
        { colors: 15, phishing: 3 },
        { colors: 10, phishing: 3 },
        { colors: 7, phishing: 3 },
      ],
    };

    let levelUp = false; // ✅ track if player moves to next level

    // Advance stage/level
    if (stage < 3) {
      stage += 1;
    } else {
      if (level < 3) {
        level += 1;
        stage = 1;
        levelUp = true; // ✅ moved to next level
      } else {
        // ✅ Game completed
        session.isCompleted = true;
        await session.save();

        const user = await User.findById(session.user);
        if (user && !user.badges.includes("🏆 Master Defender")) {
          user.badges.push("🏆 Master Defender");
          await user.save();
        }

        return res.json({
          message: "🎉 Congratulations! You completed all levels!",
          session,
        });
      }
    }

    // Generate new stage
    const { colors: totalColors, phishing } = rules[level][stage - 1];
    const colors = generateStageColors(totalColors, phishing);
    const goal = totalColors - phishing;

    session.level = level;
    session.stage = stage;
    session.colors = colors;
    session.safeClicks = 0;
    session.goal = goal;
    session.isCompleted = false;

    // ✅ Only refill lives when leveling up
    if (levelUp) {
      session.lives = 3;
    }

    await session.save();

    // Update user badges
    const user = await User.findById(session.user);
    if (user) {
      user.level = Math.max(user.level || 1, session.level);

      if (level === 2 && !user.badges.includes("🥈 Level 2 Defender")) {
        user.badges.push("🥈 Level 2 Defender");
      }
      if (level === 3 && !user.badges.includes("🥇 Level 3 Champion")) {
        user.badges.push("🥇 Level 3 Champion");
      }

      await user.save();
    }

    res.json({ 
      message: levelUp 
        ? "🚀 Level up! Lives refilled to 3 ❤️" 
        : "🚀 Stage advanced!", 
      session 
    });
  } catch (err) {
    console.error("nextStage error:", err);
    res.status(500).json({ message: "Server error in nextStage" });
  }
};



// 🎯 Resume latest unfinished session
export const resumeGame = async (req, res) => {
  try {
    const userId = req.user._id;

    let session = await GameSession.findOne({
      user: userId,
      isCompleted: false,
    }).sort({ createdAt: -1 });

    if (!session) {
      return res.status(404).json({ message: "No active session found" });
    }

    res.json(session);
  } catch (err) {
    console.error("resumeGame error:", err);
    res.status(500).json({ message: "Server error in resumeGame" });
  }
};
