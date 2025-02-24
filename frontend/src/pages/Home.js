import React, { useEffect, useState } from "react";

const Home = () => {
    const [recentOutfit, setRecentOutfit] = useState(null);
    const [mostWornItem, setMostWornItem] = useState(null);

    // ✅ Fetch the most recent outfit
    useEffect(() => {
        fetch("http://localhost:5000/api/outfits")
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    const sortedOutfits = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    setRecentOutfit(sortedOutfits[0]); // ✅ Most recent outfit
                }
            })
            .catch(error => console.error("Error fetching outfits:", error));
    }, []);

    // ✅ Fetch all outfits and determine the most worn item
    useEffect(() => {
        fetch("http://localhost:5000/api/outfits")
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    const itemUsage = {};
                    
                    // Count how often each clothing item appears in outfits
                    data.forEach(outfit => {
                        outfit.items.forEach(item => {
                            itemUsage[item._id] = (itemUsage[item._id] || 0) + 1;
                        });
                    });

                    // Find the most worn item
                    const mostWornItemId = Object.keys(itemUsage).reduce((a, b) => itemUsage[a] > itemUsage[b] ? a : b, null);

                    if (mostWornItemId) {
                        fetch(`http://localhost:5000/api/clothing/${mostWornItemId}`)
                            .then(response => response.json())
                            .then(setMostWornItem);
                    }
                }
            })
            .catch(error => console.error("Error fetching outfits:", error));
    }, []);

    return (
        <div style={styles.container}>
            <h2>Welcome to Outfitly</h2>

            {/* ✅ Most Recent Outfit */}
            {recentOutfit && (
                <div style={styles.section}>
                    <h3>👗 Most Recent Outfit</h3>
                    <p><strong>{recentOutfit.name}</strong></p>
                    <div style={styles.itemsContainer}>
                        {recentOutfit.items.map(item => (
                            <div key={item._id} style={styles.item}>
                                <img src={item.image || "https://via.placeholder.com/100"} alt={item.name} style={styles.image} />
                                <p>{item.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ✅ Most Worn Item */}
            {mostWornItem && (
                <div style={styles.section}>
                    <h3>🔥 Most Worn Item</h3>
                    <div style={styles.item}>
                        <img src={mostWornItem.image || "https://via.placeholder.com/100"} alt={mostWornItem.name} style={styles.image} />
                        <p><strong>{mostWornItem.name}</strong></p>
                        <p>Category: {mostWornItem.category}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: { 
        textAlign: "center", 
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    section: { 
        width: "80%",
        maxWidth: "500px",
        padding: "15px",
        borderRadius: "10px",
        backgroundColor: "#f8f8f8",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        marginBottom: "20px",
        textAlign: "center",
    },
    itemsContainer: { 
        display: "flex", 
        justifyContent: "center", 
        gap: "10px", 
        marginTop: "10px",
        flexWrap: "wrap",
    },
    item: { 
        textAlign: "center", 
    },
    image: { 
        width: "100px", 
        height: "100px", 
        borderRadius: "5px" 
    },
};

export default Home;
