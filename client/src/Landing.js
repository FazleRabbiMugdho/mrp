import React from "react";
import Navbar from "./Navbar";
import "./App.css";  

const Landing = () => {
  return (
    <div className="hero">
      <Navbar />
      <div className="hero-content">
        <h1>Welcome to Market Rate Price</h1>
        <h2>Fighting Price Syndication and Inflation. Click Home or Get Started to explore..</h2>
      </div>
    </div>
  );
};

export default Landing;
