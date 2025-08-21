import React, { useEffect, useState } from "react";
import { getLeaderboard } from "../../utils/api";
import "./Leaderboard.css";

const Leaderboard = () => {
  const [loading, setLoading] = useState(true);
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data } = await getLeaderboard();
        setPlayers(data.leaderboard || []);
      } catch (err) {
        setError("Could not fetch leaderboard.",err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) return <div className="leaderboard-loading">Loading leaderboard...</div>;
  if (error) return <div className="leaderboard-error">{error}</div>;

  return (
    <div className="leaderboard-wrap">
      <h2>🏅 Leaderboard</h2>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Score</th>
            <th>Level</th>
          </tr>
        </thead>
<tbody>
  {players.length === 0 ? (
    <tr>
      <td colSpan="4">No players yet. Be the first! 🎮</td>
    </tr>
  ) : (
    players.map((p, index) => (
      <tr key={p._id}>
        <td data-label="Rank">{index + 1}</td>
        <td data-label="Player">{p.username}</td>
        <td data-label="Score">{p.score}</td>
        <td data-label="Level">{p.level}</td>
      </tr>
    ))
  )}
</tbody>

      </table>
    </div>
  );
};

export default Leaderboard;
