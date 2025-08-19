import React from 'react';
import { Link } from 'react-router-dom';

const products = [
  { title: "Plasma TV set", icon: "fa-tv", current: "$567.99", original: "$10.00", discount: "", rating: 5, reviews: 1 },
  { title: "Phone", icon: "fa-mobile-alt", current: "$101.09", original: "", discount: "18% off", rating: 5, reviews: 1 },
  { title: "Audience", icon: "fa-headphones", current: "$42.00", original: "$20.00", discount: "19% off", rating: 5, reviews: 2 },
  { title: "Photo & Video", icon: "fa-camera", current: "$120.00", original: "", discount: "18% off", rating: 5, reviews: 3 },
  { title: "Gallery credits", icon: "fa-gamepad", current: "$85.00", original: "", discount: "18% off", rating: 5, reviews: 4 },
  { title: "Air conditioning", icon: "fa-fan", current: "$92.00", original: "", discount: "19% off", rating: 5, reviews: 5 },
  { title: "Audio", icon: "fa-music", current: "$42.00", original: "$20.00", discount: "19% off", rating: 5, reviews: 6 },
];

const services = [
  { icon: "fa-truck", title: "Free Delivery", desc: "For us last in our 59s" },
  { icon: "fa-undo", title: "90 Days Return", desc: "If possible have problems" },
  { icon: "fa-shield-alt", title: "Secure Payment", desc: "100% secure payment" },
  { icon: "fa-headset", title: "24/7 Support", desc: "Dedicated support" },
  { icon: "fa-gift", title: "Gift Service", desc: "Support of service" },
];

function Home() {
  return (
    <div className="container">
      <header>
        <div className="header-content">
          <div className="logo">M.R.P.</div>
          <div className="version">VERSION 2025</div>
        </div>
        <p>New version 2025 with many powerful features.</p>
        <div className="features">
          <span className="feature">Faster</span>
          <span className="feature">Fiction better</span>
          <span className="feature">Oscar Plus</span>
          <Link to="/login" className="feature">Login</Link>
        </div>
      </header>

      <section className="deals">
        <div className="section-title">
          <h2>Today Deals</h2>
          <a href="#" className="view-all">View all <i className="fas fa-chevron-right"></i></a>
        </div>

        <div className="products">
          {products.map((p, index) => (
            <div className="product-card" key={index} onClick={() => alert(`You clicked on ${p.title}`)}>
              <div className="product-image"><i className={`fas ${p.icon}`}></i></div>
              <div className="product-info">
                <h3 className="product-title">{p.title}</h3>
                <div className="product-pricing">
                  <span className="current-price">{p.current}</span>
                  {p.original && <span className="original-price">{p.original}</span>}
                  {p.discount && <span className="discount-badge">{p.discount}</span>}
                </div>
                <div className="product-rating">
                  {Array.from({ length: p.rating }).map((_, i) => <i className="fas fa-star" key={i}></i>)}
                  <span>({p.reviews})</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="services">
        {services.map((s, index) => (
          <div className="service" key={index}>
            <div className="service-icon"><i className={`fas ${s.icon}`}></i></div>
            <h3 className="service-title">{s.title}</h3>
            <p className="service-desc">{s.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Home;
