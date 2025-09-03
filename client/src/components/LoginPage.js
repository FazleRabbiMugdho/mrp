import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaGoogle, FaFacebook, FaGithub, FaEye, FaEyeSlash } from "react-icons/fa";
import "./Auth.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    let response;
    let data;
    
    try {
      
      response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Login failed');
      }

      // Save token and user data properly
      localStorage.setItem("userToken", data.token);
      localStorage.setItem("userData", JSON.stringify(data.user));
      
      console.log("Login successful!", data.user);
      
      // Navigate to dashboard
      navigate("/dashboard", { replace: true });
      
    } catch (error) {
      console.error("Login error:", error);
      console.log("Server response status:", response?.status);
      console.log("Server response data:", data);

      // Show specific error message from server
      if (data && data.error) {
        alert("Login failed: " + (data.details || data.error));
      } else if (data && data.message) {
        alert("Login failed: " + data.message);
      } else {
        alert(error.message || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Check if user is already logged in
  React.useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    const userData = localStorage.getItem("userData");
    
    if (userToken && userData) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Log in to Your Account</h2>

        <div className="social-buttons">
          <button type="button" className="social-btn google-btn"><FaGoogle />&nbsp; Google</button>
          <button type="button" className="social-btn facebook-btn"><FaFacebook />&nbsp; Facebook</button>
          <button type="button" className="social-btn github-btn"><FaGithub />&nbsp; GitHub</button>
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
              disabled={loading}
            />
          </div>

          <div className="input-group password-group">
            <FaLock className="input-icon" />
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              disabled={loading}
            />
            <button
              type="button"
              className={`password-toggle ${showPassword ? 'visible' : ''}`}
              onClick={togglePasswordVisibility}
              disabled={loading}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
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