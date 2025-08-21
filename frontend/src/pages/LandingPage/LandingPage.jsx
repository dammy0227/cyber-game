// src/pages/LandingPage/LandingPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react"; // nice cybersecurity icon

import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="landing-content">
        <ShieldCheck className="landing-icon" size={100} />
        <h1 className="landing-title">Cybersecurity Awareness Game</h1>
        <p className="landing-subtitle">
          Learn, Play, and Stay Safe Online
        </p>
        <button className="start-btn" onClick={() => navigate("/login")}>
          🚀 Start
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
