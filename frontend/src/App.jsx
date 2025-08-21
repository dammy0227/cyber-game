import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { AuthContext } from "./context/AuthContext";

import Login from "./pages/login/Login";
import Register from "./pages/Register/Register";
import MainDashboard from "./pages/MainDashboard/MainDashboard";
import LandingPage from "./pages/LandingPage/LandingPage";
import './App.css'

// ✅ Protect routes
const PrivateRoute = ({ children }) => {
  const { token, loading } = React.useContext(AuthContext);

  if (loading) {
    return <div style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</div>;
  }

  return token ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
         <Route path="/" element={<LandingPage />} />  
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ✅ Protected route */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <MainDashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
