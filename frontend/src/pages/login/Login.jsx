// src/pages/Login.jsx
import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { loginUser } from "../../utils/api";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await loginUser(formData);
      // backend returns: {_id, username, email, token}
      const userData = { _id: data._id, username: data.username, email: data.email };
      login(userData, data.token);           // save in AuthContext + localStorage
      navigate("/dashboard");                     // go straight to the game
    } catch {
      setError("❌ Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="auth-card">
          <h2>🔐 Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input type="email" name="email" placeholder="Enter email"
               value={formData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Enter password"
               value={formData.password} onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>

      {error && <p className="error-text">{error}</p>}

      <p className="auth-switch">
        New here? <Link to="/register">Create an account</Link>
      </p>
      </div>
    </div>
  );
};

export default Login;
