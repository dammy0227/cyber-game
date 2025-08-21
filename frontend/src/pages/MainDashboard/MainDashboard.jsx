import React, { useState, useEffect, useContext } from "react";
import GameBoard from "../GameBoard/GameBoard";
import Dashboard from "../Dashboard/Dashboard";
import Leaderboard from "../Leaderboard/Leaderboard";
import HowToPlay from "../HowToPlay/HowToPlay";
import { AuthContext } from "../../context/AuthContext";
import "./MainDashboard.css";

const MainDashboard = () => {
  const [activeTab, setActiveTab] = useState("game");
  const [darkMode, setDarkMode] = useState(() => {
    // Load saved theme from localStorage, default to false (light)
    return localStorage.getItem("darkMode") === "true";
  });
  const { logout } = useContext(AuthContext);

  // Save theme whenever it changes
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const renderContent = () => {
    switch (activeTab) {
      case "game":
        return <GameBoard />;
      case "dashboard":
        return <Dashboard />;
      case "leaderboard":
        return <Leaderboard />;
      case "howtoplay":
        return <HowToPlay />;
      default:
        return <GameBoard />;
    }
  };

  return (
    <div className={`dashboard-container ${darkMode ? "dark" : "light"}`}>
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="logo">Cyber Game</h2>

        <button
          className={activeTab === "game" ? "active" : ""}
          onClick={() => setActiveTab("game")}
        >
          🎮 Play Game
        </button>

        <button
          className={activeTab === "dashboard" ? "active" : ""}
          onClick={() => setActiveTab("dashboard")}
        >
          📊 My Progress
        </button>

        <button
          className={activeTab === "leaderboard" ? "active" : ""}
          onClick={() => setActiveTab("leaderboard")}
        >
          🏆 Leaderboard
        </button>

        <button
          className={activeTab === "howtoplay" ? "active" : ""}
          onClick={() => setActiveTab("howtoplay")}
        >
          📘 How to Play
        </button>

        {/* Dark/Light Toggle */}
        <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>

        {/* Logout Button */}
        <button className="logout" onClick={logout}>
          🚪 Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">{renderContent()}</div>
    </div>
  );
};

export default MainDashboard;
