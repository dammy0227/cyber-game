import React, { useEffect, useState } from "react";
import { getUserProfile } from "../../utils/api";
import "./Dashboard.css";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await getUserProfile();
        setUser(data.user);
      } catch (err) {
        setError("Failed to load profile. Please login again.", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div className="dashboard-loading">Loading dashboard...</div>;
  if (error) return <div className="dashboard-error">{error}</div>;

  return (
    <div className="dashboard-wrap">
      <h2>📊 Your Dashboard</h2>
      <div className="dashboard-card">
        <p><strong>Username:</strong> {user?.username}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Level:</strong> {user?.level ?? 1}</p>
        <p><strong>Score:</strong> {user?.score ?? 0}</p>
      </div>

      <div className="dashboard-badges">
        <h3>🏆 Badges</h3>
        {user?.badges?.length ? (
          <ul>
            {user.badges.map((badge, i) => (
              <li key={i}>🎖️ {badge}</li>
            ))}
          </ul>
        ) : (
          <p>No badges earned yet. Keep playing! 🎮</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
