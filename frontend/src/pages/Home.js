import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h2>Welcome to Outfitly</h2>
      <p>Manage your wardrobe efficiently.</p>
      
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={() => navigate("/wardrobe")}>View Wardrobe</button>
        <button style={styles.button} onClick={() => navigate("/add")}>+ Add Clothing</button>
        <button style={styles.button} onClick={() => navigate("/log-outfit")}>Log Outfit</button>
        <button style={styles.button} onClick={() => navigate("/outfit-history")}>Outfit History</button>
        <button style={styles.button} onClick={() => navigate("/search")}>Search</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "20px",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "20px",
  },
  button: {
    backgroundColor: "#333",
    color: "white",
    padding: "10px 15px",
    border: "none",
    borderRadius: "5px",
    margin: "5px",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default Home;