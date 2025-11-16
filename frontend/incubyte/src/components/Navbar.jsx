
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext"; 

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart(); 
  const nav = useNavigate();

  function handleLogout() {
    logout();
    nav("/");
  }

  return (
    <header className="navbar">
      <div className="brand">Kata Sweet Shop</div>
      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/dashboard">Sweets</Link>
        {user?.role === "admin" && <Link to="/admin">Admin</Link>}
        
        {/* ADDED PROFILE LINK (Only visible when logged in) */}
        {user && <Link to="/profile">Profile</Link>}

        <Link to="/cart" className="cart-link">
            {/* Shopping Cart Icon (Emoji) */}
            <span style={{ fontSize: '20px' }} role="img" aria-label="Shopping Cart">🛒</span>
            {/* Display total items in a badge */}
            {totalItems > 0 && <span className="cart-badge">{totalItems} </span>}
        </Link>

        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            <span className="user-badge">{user.email}</span>
            <button className="btn small" onClick={handleLogout}>Logout</button>
          </>
        )}
      </nav>
    </header>
  );
}