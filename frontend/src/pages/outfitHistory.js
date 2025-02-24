import React, { useEffect, useState } from "react";
import "../styles.css";

const OutfitHistory = () => {
    const [outfits, setOutfits] = useState([]);

    useEffect(() => {
        const savedOutfits = JSON.parse(localStorage.getItem("outfitHistory")) || [];
        setOutfits(savedOutfits);
    }, []);

    return (
        <div className="auth-container">
            <h2>Outfit History</h2>

            {outfits.length > 0 ? (
                outfits.map((outfit) => (
                    <div key={outfit.id} className="outfit-card">
                        <h3>{outfit.name}</h3>
                        <div className="outfit-items">
                            {outfit.items.map((item) => (
                                <div key={item.id} className="outfit-item">
                                    <img src={item.image || "https://via.placeholder.com/100"} alt={item.name} className="closet-image" />
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

export default OutfitHistory;
