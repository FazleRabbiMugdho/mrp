import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./App.css";

const API_BASE = "http://localhost:5000/api";

function Home() {
  const [products, setProducts] = useState([]);
  const [showComplain, setShowComplain] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [email, setEmail] = useState("");
  const [complain, setComplain] = useState("");

  const cities = [
    "Barisal",
    "Chattogram",
    "Dhaka",
    "Khulna",
    "Mymensingh",
    "Rajshahi",
    "Rangpur",
    "Sylhet",
  ];

  const fetchProducts = async (city) => {
    try {
      const url = city
        ? `${API_BASE}/products?city=${encodeURIComponent(city)}`
        : `${API_BASE}/products`;

      const res = await fetch(url);
      const data = await res.json();

      console.log("Fetched products:", data); // ✅ Debug log

      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchProducts(selectedCity);
  }, [selectedCity]);

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setShowLocation(false);
  };

  const handleComplainCitySelect = (city) => {
    setSelectedCity(city);
    setEmail(`admin.${city.toLowerCase()}@gmail.com`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Complain submitted for ${selectedCity}!`);
    setComplain("");
    setSelectedCity(null);
    setShowComplain(false);
  };

  return (
    <div className="container">
      {/* HEADER */}
      <header>
        <div className="header-content">
          <div className="logo">M.R.P.</div>
          <div className="version">VERSION 2025</div>
        </div>
        <p>New version 2025 with many powerful features.</p>

        <div className="features">
          <span
            className="feature"
            onClick={() => {
              setShowLocation(!showLocation);
              setShowComplain(false);
            }}
            style={{ cursor: "pointer" }}
          >
            Location
          </span>

          <span
            className="feature"
            onClick={() => {
              setShowComplain(!showComplain);
              setShowLocation(false);
              setSelectedCity(null);
            }}
            style={{ cursor: "pointer" }}
          >
            Complain
          </span>

          <Link to="/login" className="feature">
            Login
          </Link>
        </div>

        {/* SHOW SELECTED CITY */}
        {selectedCity && (
          <div style={{ marginTop: 8 }}>
            Showing products for <strong>{selectedCity}</strong>
            <button
              onClick={() => setSelectedCity(null)}
              style={{ marginLeft: 8 }}
            >
              Clear
            </button>
          </div>
        )}
      </header>

      {/* LOCATION PICKER */}
      {showLocation && (
        <div className="complain-section">
          <h3>Select City</h3>
          <ul className="city-list">
            {cities.map((city) => (
              <li
                key={city}
                onClick={() => handleCitySelect(city)}
                style={{ cursor: "pointer", margin: "5px 0" }}
              >
                {city}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* COMPLAIN CITY PICKER */}
      {showComplain && !selectedCity && (
        <div className="complain-section">
          <h3>Select Your City</h3>
          <ul className="city-list">
            {cities.map((city) => (
              <li
                key={city}
                onClick={() => handleComplainCitySelect(city)}
                style={{ cursor: "pointer", margin: "5px 0" }}
              >
                {city}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* COMPLAIN FORM */}
      {showComplain && selectedCity && (
        <div className="complain-form">
          <h3>Complain for {selectedCity}</h3>
          <form onSubmit={handleSubmit}>
            <div>
              <input type="email" value={email} readOnly />
            </div>
            <div>
              <textarea
                placeholder="Enter your complain"
                value={complain}
                onChange={(e) => setComplain(e.target.value)}
                required
              />
            </div>
            <button type="submit">Submit Complain</button>
          </form>
        </div>
      )}

      {/* PRODUCT LIST */}
      <section className="deals">
        <div className="section-title">
          <h2>Today Product's Price</h2>
          <a href="#" className="view-all">
            View all <i className="fas fa-chevron-right"></i>
          </a>
        </div>

        <div className="products">
          {Array.isArray(products) && products.length > 0 ? (
            products.map((p) => (
              <div className="product-card" key={p._id}>
                <div className="product-image">
                  {p.imageUrl ? (
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      style={{ width: 100, height: 100, objectFit: "cover" }}
                    />
                  ) : (
                    <i className="fas fa-box"></i>
                  )}
                </div>
                <div className="product-info">
                  <h3 className="product-title">{p.title}</h3>
                  <div className="product-pricing">
                    <span className="current-price">৳{p.price}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>
              No products available
              {selectedCity ? ` for ${selectedCity}` : ""}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;
