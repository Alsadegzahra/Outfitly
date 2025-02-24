import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();

    return (
        <nav style={styles.navbar}>
            {/* ✅ Bigger Logo */}
            <img 
                src="/big_logo.png"  
                alt="Outfitly Logo" 
                style={styles.logo} 
                onClick={() => navigate("/")} 
            />

            {/* ✅ Responsive Buttons Below the Logo */}
            <div style={styles.navLinks}>
                <button onClick={() => navigate("/")} style={styles.button}>Home</button>
                <button onClick={() => navigate("/wardrobe")} style={styles.button}>Wardrobe</button>
                <button onClick={() => navigate("/add")} style={styles.button}>+ Add Clothing</button>
                <button onClick={() => navigate("/log-outfit")} style={styles.button}>Log Outfit</button>
                <button onClick={() => navigate("/outfit-history")} style={styles.button}>Outfit History</button>
                <button onClick={() => navigate("/search")} style={styles.button}>Search</button>
            </div>
        </nav>
    );
};

const styles = {
    navbar: {
        display: "flex",
        flexDirection: "column", 
        alignItems: "center",
        backgroundColor: "white",  // ✅ Keep background white
        padding: "20px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        width: "100%",  
        maxWidth: "100%", 
        overflow: "hidden",
    },
    logo: {
        height: "120px",  
        cursor: "pointer",
        marginBottom: "15px",
    },
    navLinks: {
        display: "flex",
        flexWrap: "wrap",  
        justifyContent: "center",
        gap: "10px",
        width: "100%",
        maxWidth: "100%",
        padding: "0 10px",  
    },
    button: {
        backgroundColor: "#D99A9C",  // ✅ Updated button background color
        color: "#E31E25",  // ✅ Red text color
        padding: "8px 12px",  
        border: "2px solid #E31E25", // ✅ Red border color
        borderRadius: "5px",
        fontSize: "14px",
        cursor: "pointer",
        transition: "0.3s",
        flex: "1 1 auto",  
        maxWidth: "150px",
        minWidth: "80px",  
        textAlign: "center",
    },
    buttonHover: {
        backgroundColor: "#E31E25",  // ✅ Red background on hover
        color: "white",  // ✅ White text on hover
    },
};

export default Navbar;
