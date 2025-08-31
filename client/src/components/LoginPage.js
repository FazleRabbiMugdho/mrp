import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaGoogle, FaFacebook, FaGithub } from "react-icons/fa";
import "./Auth.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    
    try {
      // Simulate login validation (replace with actual API call)
      console.log("Login attempt:", { email, password });
      
      // Set authentication token
      localStorage.setItem("userToken", "authenticated");
      localStorage.setItem("userData", JSON.stringify({
        email: email,
        loggedIn: true,
        timestamp: new Date().toISOString()
      }));
      
      // Navigate to dashboard
      navigate("/dashboard", { replace: true });
      
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Check if user is already logged in
  React.useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

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
            <input 
              type="email" 
              placeholder="Email address" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="input-group">
            <FaLock className="input-icon" />
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}