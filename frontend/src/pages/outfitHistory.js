import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const OutfitHistory = () => {
    const navigate = useNavigate();
    const [outfits, setOutfits] = useState([]);

    // Load outfits from localStorage
    useEffect(() => {
        const savedOutfits = JSON.parse(localStorage.getItem("outfitHistory")) || [];
        setOutfits(savedOutfits);
    }, []);

    return (
        <div style={styles.container}>
            <button onClick={() => navigate("/")} style={styles.homeButton}>🏠 Home</button>
            <h2>Outfit History</h2>

            {outfits.length > 0 ? (
                outfits.map((outfit) => (
                    <div key={outfit.id} style={styles.outfitContainer}>
                        <h3>{outfit.name}</h3>
                        <div style={styles.clothingContainer}>
                            {outfit.items.map((item) => (
                                <div key={item.id} style={styles.clothingItem}>
                                    <img src={item.image || "https://via.placeholder.com/100"} alt={item.name} style={styles.image} />
                                    <p>{item.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <p>No outfits saved yet. Log an outfit to see it here!</p>
            )}
        </div>
    );
};

const styles = {
    container: { textAlign: "center", padding: "20px" },
    homeButton: { margin: "10px", padding: "10px", fontSize: "16px", cursor: "pointer" },
    outfitContainer: { border: "1px solid #ddd", margin: "10px", padding: "10px", borderRadius: "5px", textAlign: "center" },
    clothingContainer: { display: "flex", flexWrap: "wrap", justifyContent: "center", marginTop: "10px" },
    clothingItem: { margin: "10px", padding: "10px", textAlign: "center", width: "100px" },
    image: { width: "100%", borderRadius: "5px" },
};

export default OutfitHistory;
