import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css";

/**
 * Navbar component that provides navigation across the Outfitly app.
 * 
 * @component
 * @returns {JSX.Element} - Rendered Navbar component.
 */
const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <img 
        src="/big_logo.png"  
        alt="Outfitly Logo" 
        className="logo" 
        onClick={() => navigate("/")} 
      />

      <div className="navbar-links">
        <button onClick={() => navigate("/")} className="nav-button">Home</button>
        <button onClick={() => navigate("/closet")} className="nav-button">Closet</button>
        <button onClick={() => navigate("/add-clothing")} className="nav-button">+ Add Clothing</button>
        <button onClick={() => navigate("/log-outfit")} className="nav-button">Log Outfit</button>
        <button onClick={() => navigate("/outfit-history")} className="nav-button">Outfit History</button>
        <button onClick={() => navigate("/search")} className="nav-button">Search</button>
        <button onClick={() => navigate("/login")} className="nav-button">Log In</button>
        <button onClick={() => navigate("/signup")} className="nav-button">Sign Up</button>
        <button onClick={() => navigate("/logout")} className="nav-button">Log Out</button>
      </div>
    </nav>
  );
};

export default Navbar;
