import React from "react";
import "./HowToPlay.css";

const HowToPlay = () => {
  return (
    <div className="howtoplay-container">
      <h1>🎮 Game Concept</h1>
      <p>You’re presented with a grid of colors.</p>
      <ul>
        <li>Some of the colors are phishing (bad).</li>
        <li>Your task: click only the safe colors until you clear the stage.</li>
        <li>If you click a phishing color, you lose 1 life (you start with 3).</li>
        <li>Clear all safe colors → advance to the next stage.</li>
        <li>Clear 3 stages → advance to the next level (lives refill to 3).</li>
        <li>Clear all 3 levels → 🎉 You win the game!</li>
      </ul>

      <h2>🥉 Level 1: Beginner Defender</h2>
      <p><strong>Stage 1:</strong> 10 colors, 1 phishing, goal = 9 safe clicks</p>
      <p><strong>Stage 2:</strong> 7 colors, 1 phishing, goal = 6 safe clicks</p>
      <p><strong>Stage 3:</strong> 5 colors, 1 phishing, goal = 4 safe clicks</p>
      <p>✅ Clear all → move to Level 2 (lives reset ❤️)  
      🏅 Badge: "🥉 Level 1 Survivor"</p>

      <h2>🥈 Level 2: Skilled Defender</h2>
      <p><strong>Stage 1:</strong> 10 colors, 2 phishing, goal = 8 safe clicks</p>
      <p><strong>Stage 2:</strong> 7 colors, 2 phishing, goal = 5 safe clicks</p>
      <p><strong>Stage 3:</strong> 5 colors, 2 phishing, goal = 3 safe clicks</p>
      <p>✅ Clear all → move to Level 3 (lives reset ❤️)  
      🏅 Badge: "🥈 Level 2 Defender"</p>

      <h2>🥇 Level 3: Master Defender</h2>
      <p><strong>Stage 1:</strong> 15 colors, 3 phishing, goal = 12 safe clicks</p>
      <p><strong>Stage 2:</strong> 10 colors, 3 phishing, goal = 7 safe clicks</p>
      <p><strong>Stage 3:</strong> 7 colors, 3 phishing, goal = 4 safe clicks</p>
      <p>✅ Clear all → 🎉 You win the game!  
      🏅 Badge: "🥇 Level 3 Champion" + "🏆 Master Defender"</p>

      <h2>❤️ Lives & Rules Recap</h2>
      <ul>
        <li>Start every Level with 3 lives.</li>
        <li>Wrong click (phishing) → lose 1 life.</li>
        <li>Lose all 3 lives → ❌ Game Over (restart from Level 1, Stage 1).</li>
        <li>Clear 3 stages → 🎯 move up to next Level (lives refill).</li>
      </ul>
    </div>
  );
};

export default HowToPlay;
