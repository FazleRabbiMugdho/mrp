import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaPhone, FaLock, FaGoogle, FaFacebook, FaGithub, FaUsers } from "react-icons/fa";
import "./Auth.css";

export default function SignupPage() {
  const [form, setForm] = useState({
    role: "merchant",
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordStrength, setPasswordStrength] = useState("");
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.mobile || !form.password || !form.confirmPassword) {
      alert("Please fill all fields");
      return;
    }
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Signup:", form);

    if (form.role === "administrator") navigate("/admin-dashboard");
    else navigate("/merchant-dashboard");
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
            <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input type="email" name="email" placeholder="Email Address" value={form.email} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <FaPhone className="input-icon" />
            <input type="text" name="mobile" placeholder="Mobile Number" value={form.mobile} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <FaLock className="input-icon" />
            <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
          </div>
          <div className="password-strength">{passwordStrength}</div>

          <div className="input-group">
            <FaLock className="input-icon" />
            <input type="password" name="confirmPassword" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} required />
          </div>

          <button type="submit" className="auth-btn">Sign Up</button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}


