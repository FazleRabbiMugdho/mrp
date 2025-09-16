import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./App.css";  

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav>
      <div className="logo">M.R.P</div>

      <ul id="menu" className={menuOpen ? "active" : ""}>
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <Link to="/login" className="feature">
                    Login
                  </Link>
        <Link to="/signup" className="feature">
                    Sign Up
                  </Link>
      </ul>

      <Link to="/home">
        <button className="btn">Get Started</button>
      </Link>

      <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  );
};

export default Navbar;
