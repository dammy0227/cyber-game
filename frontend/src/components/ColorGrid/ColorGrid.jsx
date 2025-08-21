// src/components/ColorGrid/ColorGrid.jsx
import React from "react";
import "./ColorGrid.css";

const ColorGrid = ({ colors, onColorClick }) => {
  return (
    <div className="color-grid">
      {colors.map((color, index) => (
        <div
          key={index}
          className={`color-box ${color.clicked ? "faded" : ""}`}
          style={{ backgroundColor: color.hex }}
          onClick={() => !color.clicked && onColorClick(index)}
        ></div>
      ))}
    </div>
  );
};

export default ColorGrid;
