import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaGoogle, FaFacebook, FaGithub } from "react-icons/fa";
import "./Auth.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }
    console.log("Login:", { email, password });
    navigate("/dashboard");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Log in to Your Account</h2>

        <div className="social-buttons">
          <button className="social-btn google-btn"><FaGoogle />&nbsp; Google</button>
          <button className="social-btn facebook-btn"><FaFacebook />&nbsp; Facebook</button>
          <button className="social-btn github-btn"><FaGithub />&nbsp; GitHub</button>
        </div>

        <div className="divider">or</div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="input-group">
            <FaLock className="input-icon" />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <button type="submit" className="auth-btn">Log In</button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}