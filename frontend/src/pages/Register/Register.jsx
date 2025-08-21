// src/pages/Register.jsx
import React, { useState } from "react";
import { registerUser } from "../../utils/api";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await registerUser(formData);
      navigate("/login");                    // go to login after success
    } catch {
      setError("❌ Registration failed. Try again.");
    }
  };

  return (
    <div className="register-container">
      <div className="auth-card">
                  <h2>📝 Register</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <input type="text" name="username" placeholder="Enter username"
               value={formData.username} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Enter email"
               value={formData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Enter password"
               value={formData.password} onChange={handleChange} required />
        <button type="submit">Register</button>
      </form>

      {error && <p className="error-text">{error}</p>}

      <p className="auth-switch">
        Already have an account? <Link to="/login">Login</Link>
      </p>
      </div>
    </div>
  );
};

export default Register;
