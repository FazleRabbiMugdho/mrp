import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaPhone, FaLock, FaMapMarkerAlt, FaAt, FaEye, FaEyeSlash, FaStore, FaUserCog } from "react-icons/fa";
import "./Auth.css";
import logo from "../assets/MRP logo.png";

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
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({...errors, [name]: ""});
    }

    if (name === "password") {
      if (value.length === 0) {
        setPasswordStrength("");
      } else if (value.length < 6) {
        setPasswordStrength("Weak ❌");
      } else if (value.match(/[A-Z]/) && value.match(/[0-9]/) && value.match(/[^A-Za-z0-9]/)) {
        setPasswordStrength("Strong ✅");
      } else {
        setPasswordStrength("Medium ⚠️");
      }
    }
    
    // Validate passwords match in real-time
    if ((name === "password" || name === "confirmPassword") && form.confirmPassword) {
      if (name === "password" && form.confirmPassword !== value) {
        setErrors({...errors, confirmPassword: "Passwords do not match"});
      } else if (name === "confirmPassword" && form.password !== value) {
        setErrors({...errors, confirmPassword: "Passwords do not match"});
      } else if (errors.confirmPassword) {
        setErrors({...errors, confirmPassword: ""});
      }
    }
  };

  const handleRoleSelect = (role) => {
    setForm({ ...form, role });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.username.trim()) newErrors.username = "Username is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Email is invalid";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    if (!form.location.trim()) newErrors.location = "Location is required";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (!form.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

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
          role: form.role,
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
        <img src={logo} alt="MRP Logo" className="auth-logo" />
        
        <h2 className="auth-title">Create a New Account</h2>

        <form onSubmit={handleSubmit}>
          {/* Role Selection */}
          <div className="role-selection">
            <h3 className="role-title">Select Your Role</h3>
            <div className="role-options">
              <div 
                className={`role-option ${form.role === 'merchant' ? 'selected' : ''}`}
                onClick={() => handleRoleSelect('merchant')}
              >
                <div className="role-icon">
                  <FaStore />
                </div>
                <div className="role-info">
                  <h4>Merchant</h4>
                  <p>Manage products, inventory, and sales</p>
                </div>
              </div>
              
              <div 
                className={`role-option ${form.role === 'administrator' ? 'selected' : ''}`}
                onClick={() => handleRoleSelect('administrator')}
              >
                <div className="role-icon">
                  <FaUserCog />
                </div>
                <div className="role-info">
                  <h4>Administrator</h4>
                  <p>Manage system settings and users</p>
                </div>
              </div>
            </div>
          </div>

          <div className="input-group">
            <FaUser className="input-icon" />
            <input 
              type="text" 
              name="firstName" 
              placeholder="First Name *" 
              value={form.firstName} 
              onChange={handleChange} 
              className={errors.firstName ? "error" : ""}
            />
            {errors.firstName && <span className="error-text">{errors.firstName}</span>}
          </div>

          <div className="input-group">
            <FaUser className="input-icon" />
            <input 
              type="text" 
              name="lastName" 
              placeholder="Last Name" 
              value={form.lastName} 
              onChange={handleChange} 
            />
          </div>

          <div className="input-group">
            <FaAt className="input-icon" />
            <input 
              type="text" 
              name="username" 
              placeholder="Username *" 
              value={form.username} 
              onChange={handleChange} 
              className={errors.username ? "error" : ""}
            />
            {errors.username && <span className="error-text">{errors.username}</span>}
          </div>

          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input 
              type="email" 
              name="email" 
              placeholder="Email Address *" 
              value={form.email} 
              onChange={handleChange} 
              className={errors.email ? "error" : ""}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="input-group">
            <FaPhone className="input-icon" />
            <input 
              type="text" 
              name="phone" 
              placeholder="Phone Number *" 
              value={form.phone} 
              onChange={handleChange} 
              className={errors.phone ? "error" : ""}
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>

          <div className="input-group">
            <FaMapMarkerAlt className="input-icon" />
            <input 
              type="text" 
              name="location" 
              placeholder="Your Location *" 
              value={form.location} 
              onChange={handleChange} 
              className={errors.location ? "error" : ""}
            />
            {errors.location && <span className="error-text">{errors.location}</span>}
          </div>

          <div className="input-group password-group">
            <FaLock className="input-icon" />
            <input 
              type={showPassword ? "text" : "password"} 
              name="password" 
              placeholder="Password *" 
              value={form.password} 
              onChange={handleChange} 
              className={errors.password ? "error" : ""}
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
          {form.password && <div className={`password-strength ${passwordStrength.includes('Strong') ? 'strong' : passwordStrength.includes('Medium') ? 'medium' : 'weak'}`}>
            {passwordStrength}
          </div>}
          {errors.password && <span className="error-text">{errors.password}</span>}

          <div className="input-group password-group">
            <FaLock className="input-icon" />
            <input 
              type={showConfirmPassword ? "text" : "password"} 
              name="confirmPassword" 
              placeholder="Confirm Password *" 
              value={form.confirmPassword} 
              onChange={handleChange} 
              className={errors.confirmPassword ? "error" : ""}
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
          {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}

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