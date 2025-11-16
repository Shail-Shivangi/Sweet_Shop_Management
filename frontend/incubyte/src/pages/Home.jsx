import React from "react";
import "../styles/home.css";
import Header from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

// ADDED: Static data for the Popular Sweets preview section
const popularSweets = [
  { 
    id: 11,
      name: "Ras Malai",
      price: "750 for 500gm",
      image: "../assets/rasMalai.jpg",
     shortDesc: "Soft cottage cheese patties dipped in sweetened."
  },
  { 
    id: 3, 
    name: "Kaju Katli", 
    image: "/assets/kajuKatli2.jpg", 
    price: "700 for 500gm", 
    shortDesc: "Smooth cashew fudge cut into diamonds."
  },
  { 
    id: 4, 
    name: "Ladoo", 
    image: "/assets/ladoo.jpg", 
    price: "350 for 500gm", 
    shortDesc: "Round delights made from gram flour and ghee."
  },
  {
  id: 2,
      name: "Rasgulla",
      price: 490,     
      image: "../assets/rasgulla.jpg",
     shortDesc: "Cottage cheese balls boiled in light sugar syrup."
  }
];

const Home = () => {
  return (
    <>
      {/* HERO SECTION */}
      <Header/>
      <section className="hero">
        <div className="overlay"></div>

        <div className="hero-content">
          <h1>Welcome to Sweet Delights 🍬</h1>
          <p>Your favourite place for cakes, chocolates, and sweets!</p>
          <Link to="/dashboard">
          <button className="btn">Shop Now</button>
          </Link>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="features">
        <h2>Why Choose Us?</h2>

        <div className="feature-container">
          <div className="feature-card">
            <h3>Fresh Ingredients</h3>
            <p>We use the best quality ingredients for all our products.</p>
          </div>

          <div className="feature-card">
            <h3>Unique Flavours</h3>
            <p>From classic to modern favourites, we have it all!</p>
          </div>

          <div className="feature-card">
            <h3>Fast Delivery</h3>
            <p>Your sweets delivered fresh and on time.</p>
          </div>
        </div>
      </section>

      {/* ADDED: POPULAR SWEETS SECTION */}
      <section className="popular-sweets">
        <h2>Our Popular Sweets</h2>
        <div className="sweet-preview-container">
          {popularSweets.map((sweet) => (
            <Link to={`/sweet/${sweet.id}`} key={sweet.id} className="sweet-preview-card">
              <img src={sweet.image} alt={sweet.name} />
              <h3>{sweet.name}</h3>
              <p className="muted">{sweet.shortDesc}</p>
              <p className="price">₹ {sweet.price}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <Footer >
        {/* <p>© 2025 SweetDelights. All Rights Reserved.</p> */}
      </Footer>
    </>
  );
};

export default Home;