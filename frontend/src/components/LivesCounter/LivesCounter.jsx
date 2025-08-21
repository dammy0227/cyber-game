// src/components/LivesCounter.jsx
import React from "react";
import "./LivesCounter.css";

const LivesCounter = ({ lives }) => {
  return (
    <div className="lives-counter">
      {Array.from({ length: lives }).map((_, i) => (
        <span key={i} className="life">❤️</span>
      ))}
    </div>
  );
};

export default LivesCounter;
