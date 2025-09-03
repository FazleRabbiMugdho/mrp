import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaPhone, FaLock, FaGoogle, FaFacebook, FaGithub, FaUsers, FaMapMarkerAlt, FaAt, FaEye, FaEyeSlash } from "react-icons/fa";
import "./Auth.css";

export default function SignupPage() {
  const [form, setForm] = useState({
    role: "merchant",
    firstName: "",
    lastName: "",  
    username: "",
    email: "",
    phone: "",
    location: "",  
    password: "",
    confirmPassword: "",
  });
  const [passwordStrength, setPasswordStrength] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "password") {
      if (value.length < 6) setPasswordStrength("Weak ❌");
      else if (value.match(/[A-Z]/) && value.match(/[0-9]/)) setPasswordStrength("Strong ✅");
      else setPasswordStrength("Medium ⚠️");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.firstName || !form.username || !form.email || !form.phone || !form.location || !form.password || !form.confirmPassword) {
      alert("Please fill all required fields");
      return;
    }
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);
    let response;
    let data;

    try {
      response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          username: form.username,
          email: form.email,
          password: form.password,
          phone: form.phone,
          location: form.location,
        }),
      });

      data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      console.log("Signup successful:", data);
      alert('Registration Successful! Please login.');
      navigate("/login");

    } catch (error) {
      console.error("Signup error:", error);
      console.log("Server response status:", response?.status);
      console.log("Server response data:", data);

      if (data && data.message) {
        alert("Registration failed: " + data.message);
      } else {
        alert(error.message || "Signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create a New Account</h2>

        <div className="social-buttons">
          <button className="social-btn google-btn"><FaGoogle />&nbsp; Google</button>
          <button className="social-btn facebook-btn"><FaFacebook />&nbsp; Facebook</button>
          <button className="social-btn github-btn"><FaGithub />&nbsp; GitHub</button>
        </div>

        <div className="divider">or</div>

        <form onSubmit={handleSubmit}>
          <div className="input-group select-group">
            <FaUsers className="input-icon" />
            <select name="role" value={form.role} onChange={handleChange} required>
              <option value="merchant">🛒 Merchant</option>
              <option value="administrator">🛠️ Administrator</option>
            </select>
          </div>

          <div className="input-group">
            <FaUser className="input-icon" />
            <input type="text" name="firstName" placeholder="First Name *" value={form.firstName} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <FaUser className="input-icon" />
            <input type="text" name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} />
          </div>

          <div className="input-group">
            <FaAt className="input-icon" />
            <input type="text" name="username" placeholder="Username *" value={form.username} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input type="email" name="email" placeholder="Email Address *" value={form.email} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <FaPhone className="input-icon" />
            <input type="text" name="phone" placeholder="Phone Number *" value={form.phone} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <FaMapMarkerAlt className="input-icon" />
            <input type="text" name="location" placeholder="Your Location *" value={form.location} onChange={handleChange} required />
          </div>

          <div className="input-group password-group">
            <FaLock className="input-icon" />
            <input 
              type={showPassword ? "text" : "password"} 
              name="password" 
              placeholder="Password *" 
              value={form.password} 
              onChange={handleChange} 
              required 
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
          <div className="password-strength">{passwordStrength}</div>

          <div className="input-group password-group">
            <FaLock className="input-icon" />
            <input 
              type={showConfirmPassword ? "text" : "password"} 
              name="confirmPassword" 
              placeholder="Confirm Password *" 
              value={form.confirmPassword} 
              onChange={handleChange} 
              required 
            />
            <button
              type="button"
              className={`password-toggle ${showConfirmPassword ? 'visible' : ''}`}
              onClick={toggleConfirmPasswordVisibility}
              disabled={loading}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}