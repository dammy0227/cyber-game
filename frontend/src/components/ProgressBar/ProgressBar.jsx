// src/components/ProgressBar.jsx
import React from "react";
import "./ProgressBar.css";

const ProgressBar = ({ current, total }) => {
  const percentage = (current / total) * 100;

  return (
    <div className="progress-bar">
      <div
        className="progress-fill"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
