import React from "react";
import { useNavigate } from "react-router-dom";

const LogOutfit = () => {
    const navigate = useNavigate();

    return (
        <div style={styles.container}>
            <button onClick={() => navigate("/")} style={styles.homeButton}>🏠 Home</button>
            <h2>Log an Outfit</h2>
            <p>Feature under construction...</p>
        </div>
    );
};

const styles = {
    container: {
        textAlign: "center",
        padding: "20px",
    },
    homeButton: {
        margin: "10px",
        padding: "10px",
        fontSize: "16px",
        cursor: "pointer",
    },
};

export default LogOutfit;
