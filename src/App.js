import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/merchant-dashboard" element={<h1>Merchant Dashboard 🛒</h1>} />
        <Route path="/admin-dashboard" element={<h1>Administrator Dashboard 🛠️</h1>} />
      </Routes>
    </Router>
  );
}

export default App;


