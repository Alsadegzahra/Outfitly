import React, { useEffect, useState } from "react";
import "../styles.css";

const Home = () => {
    const [recentOutfit, setRecentOutfit] = useState(null);
    const [mostWornItem, setMostWornItem] = useState(null);

    useEffect(() => {
        fetch("http://localhost:5000/api/outfits")
            .then(response => response.json())
            .then(data => {
                console.log("Fetched outfits:", data);
                if (data.length > 0) {
                    const sortedOutfits = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    setRecentOutfit(sortedOutfits[0]);
                }
            })
            .catch(error => console.error("Error fetching outfits:", error));
    }, []);

    useEffect(() => {
        fetch("http://localhost:5000/api/outfits")
            .then(response => response.json())
            .then(data => {
                console.log("Outfits for most worn item:", data);
                if (data.length > 0) {
                    const itemUsage = {};
                    data.forEach(outfit => {
                        if (outfit.items) {
                            outfit.items.forEach(item => {
                                if (item._id) {
                                    itemUsage[item._id] = (itemUsage[item._id] || 0) + 1;
                                }
                            });
                        }
                    });

                    const mostWornItemId = Object.keys(itemUsage).reduce((a, b) => itemUsage[a] > itemUsage[b] ? a : b, null);
                    console.log("Most worn item ID:", mostWornItemId);

                    if (mostWornItemId) {
                        fetch(`http://localhost:5000/api/clothing/${mostWornItemId}`)
                            .then(response => response.json())
                            .then(data => {
                                console.log("Fetched most worn item:", data);
                                setMostWornItem(data);
                            })
                            .catch(error => console.error("Error fetching most worn item:", error));
                    }
                }
            })
            .catch(error => console.error("Error fetching outfits:", error));
    }, []);

    return (
        <div className="home-container">
            <h2>Welcome to Outfitly</h2>
            {recentOutfit ? (
                <div className="home-section">
                    <h3>👗 Most Recent Outfit</h3>
                    <p><strong>{recentOutfit.name}</strong></p>
                    <div className="items-container">
                        {recentOutfit.items.map(item => (
                            <div key={item._id} className="item">
                                <img src={item.image || "https://via.placeholder.com/100"} alt={item.name} />
                                <p>{item.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ) : <p>Loading recent outfit...</p>}
            {mostWornItem ? (
                <div className="home-section">
                    <h3>🔥 Most Worn Item</h3>
                    <div className="item">
                        <img src={mostWornItem.image || "https://via.placeholder.com/100"} alt={mostWornItem.name} />
                        <p><strong>{mostWornItem.name}</strong></p>
                        <p>Category: {mostWornItem.category}</p>
                    </div>
                </div>
            ) : <p>Loading most worn item...</p>}
        </div>
    );
};

export default Home;
