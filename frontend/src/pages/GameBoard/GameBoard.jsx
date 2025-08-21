// src/pages/GameBoard/GameBoard.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  startGame as apiStartGame,
  nextStage as apiNextStage,
  makeMove as apiMakeMove,
  resumeGame as apiResumeGame, // ✅ include resumeGame
} from "../../utils/api";
import "./GameBoard.css";

// Components
import ColorGrid from "../../components/ColorGrid/ColorGrid";
import LivesCounter from "../../components/LivesCounter/LivesCounter";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import PopupMessage from "../../components/PopupMessage/PopupMessage";

const getStageGoal = (stage) => {
  const goals = [7, 5, 3];
  return goals[Math.max(0, Math.min(stage - 1, goals.length - 1))];
};

const GameBoard = () => {
  const [loading, setLoading] = useState(true);

  // Session state
  const [sessionId, setSessionId] = useState(null);
  const [level, setLevel] = useState(1);
  const [stage, setStage] = useState(1);
  const [lives, setLives] = useState(3);
  const [safeClicks, setSafeClicks] = useState(0);
  const [colors, setColors] = useState([]); // { color, isPhishing, clicked }

  // UI state
  const [popup, setPopup] = useState("");
  const [blocking, setBlocking] = useState(false);

  const goal = useMemo(() => getStageGoal(stage), [stage]);

  const gridColors = useMemo(
    () => colors.map((c) => ({ ...c, hex: c.color })),
    [colors]
  );

  // ✅ Fixed: Load session with resume fallback
  const loadSession = async () => {
    setLoading(true);
    try {
      // Try resume first
      const { data } = await apiResumeGame();
      setSessionId(data._id);
      setLevel(data.level);
      setStage(data.stage);
      setLives(data.lives ?? 3);
      setSafeClicks(data.safeClicks ?? 0);
      setColors(data.colors ?? []);
    } catch {
      // If no session, start new
      try {
        const { data } = await apiStartGame();
        setSessionId(data._id);
        setLevel(data.level);
        setStage(data.stage);
        setLives(data.lives ?? 3);
        setSafeClicks(data.safeClicks ?? 0);
        setColors(data.colors ?? []);
      } catch {
        setPopup("Could not start game session. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSession();
  }, []);

  const handleAdvanceStage = async () => {
    try {
      const { data } = await apiNextStage(sessionId);
      const s = data.session ?? {};
      setSessionId(s._id ?? sessionId);
      setLevel(s.level ?? level);
      setStage(s.stage ?? stage);
      setLives(s.lives ?? lives);
      setSafeClicks(s.safeClicks ?? 0);
      setColors(s.colors ?? []);
      setPopup(data.message || "Stage advanced 🚀");
    } catch {
      setPopup("Could not move to next stage. Please try again.");
    }
  };

  const onColorClick = async (index) => {
    if (blocking || loading) return;
    if (colors[index]?.clicked) return;

    // Optimistic fade
    setColors((prevColors) =>
      prevColors.map((c, i) => (i === index ? { ...c, clicked: true } : c))
    );

    setBlocking(true);
    try {
      const { data } = await apiMakeMove(sessionId, index);
      const s = data.session;

      if (!s) {
        setPopup(data.message || "Unexpected server response.");
        return;
      }

      setLives(s.lives ?? lives);
      setSafeClicks(s.safeClicks ?? safeClicks);
      setColors(s.colors ?? colors);

      if (data.message) setPopup(data.message);

      if ((data.message || "").toLowerCase().includes("game over")) return;

      if ((s.safeClicks ?? 0) >= goal) {
        setPopup("🎉 Great job! Stage complete. Moving to the next stage…");
        return;
      }
    } catch {
      setPopup("Move failed. Check your connection and try again.");
    } finally {
      setBlocking(false);
    }
  };

  const handleClosePopup = async () => {
    const msg = (popup || "").toLowerCase();
    setPopup("");

    if (msg.includes("game over")) {
      await loadSession();
      return;
    }

    if (msg.includes("stage complete")) {
      await handleAdvanceStage();
      return;
    }

    if (msg.includes("stage advanced")) {
      return; // just close popup
    }
  };

  return (
    <div className="gameboard-wrap">
      <div className="gb-header">
        <div className="gb-title">
          <h2>🎯 Cybersecurity Awareness Game</h2>
          <p>
            Level {level} • Stage {stage}
          </p>
        </div>

        <div className="gb-status">
          <LivesCounter lives={lives} />
          <div className="gb-progress">
            <span>
              Safe picks: {safeClicks}/{goal}
            </span>
            <ProgressBar current={safeClicks} total={goal} />
          </div>
        </div>
      </div>

      <div className="gb-body">
        {loading ? (
          <div className="gb-loading">Loading game…</div>
        ) : (
          <ColorGrid colors={gridColors} onColorClick={onColorClick} />
        )}
      </div>

      <PopupMessage message={popup} onClose={handleClosePopup} />
    </div>
  );
};

export default GameBoard;
