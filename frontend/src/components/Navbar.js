import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav style={styles.navbar}>
      <h1 style={styles.logo}>Outfitly</h1>
      <div>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/add" style={styles.link}>Add Clothing</Link>
        <Link to="/closet" style={styles.link}>Closet</Link>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#333",
    padding: "10px 20px",
    color: "white",
  },
  logo: {
    fontSize: "1.5rem",
  },
  link: {
    margin: "0 10px",
    color: "white",
    textDecoration: "none",
    fontSize: "1.2rem",
  }
};

export default Navbar;
