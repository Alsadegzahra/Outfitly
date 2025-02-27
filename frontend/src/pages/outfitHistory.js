import React, { useEffect, useState } from "react";

const OutfitHistory = () => {
    const [outfits, setOutfits] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/outfits")
            .then(response => response.json())
            .then(data => setOutfits(data))
            .catch(error => console.error("❌ Error fetching outfits:", error));
    }, []);

    const deleteOutfit = async (outfitId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/outfits/${outfitId}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Failed to delete outfit");

            setOutfits(outfits.filter(outfit => outfit._id !== outfitId));
            console.log("✅ Outfit deleted successfully");
        } catch (error) {
            console.error("❌ Error deleting outfit:", error);
            alert("Error deleting outfit.");
        }
    };

    return (
        <div>
            <h2>Outfit History</h2>
            {outfits.length > 0 ? (
                outfits.map((outfit) => (
                    <div key={outfit._id} style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "10px" }}>
                        <h3>{outfit.name}</h3>
                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                            {outfit.items.length > 0 ? (
                                outfit.items.map((item) => (
                                    <div key={item._id} style={{ textAlign: "center" }}>
                                        <img 
                                            src={item.image || "https://placehold.co/100"} 
                                            alt={item.name} 
                                            style={{ width: "100px", display: "block", marginBottom: "5px" }}
                                        />
                                        <p>{item.name}</p> {/* ✅ Show item name below image */}
                                    </div>
                                ))
                            ) : (
                                <p>No items in this outfit.</p>
                            )}
                        </div>
                        <button 
                            onClick={() => deleteOutfit(outfit._id)} 
                            style={{ backgroundColor: "red", color: "white", padding: "5px 10px", border: "none", cursor: "pointer", marginTop: "10px" }}
                        >
                            ❌ Delete Outfit
                        </button>
                    </div>
                ))
            ) : (
                <p>No outfits found. Add an outfit to see it here! 👕👗</p>
            )}
        </div>
    );
};

export default OutfitHistory;
