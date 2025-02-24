import React, { useEffect, useState } from "react";
import "../styles.css"; 

const LogOutfit = () => {
    const [clothingItems, setClothingItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [outfitName, setOutfitName] = useState("");
    const [showPopup, setShowPopup] = useState(false);


    useEffect(() => {
        fetch("http://localhost:5000/api/clothing")
            .then(response => response.json())
            .then(data => {
                const validItems = data.filter(item => item !== null);
                setClothingItems(validItems);
            })
            .catch(error => console.error("Error fetching wardrobe:", error));
    }, []);

 
    const toggleSelection = (item) => {
        if (selectedItems.some(selected => selected._id === item._id)) {
            setSelectedItems(selectedItems.filter(selected => selected._id !== item._id));
        } else {
            setSelectedItems([...selectedItems, item]);
        }
    };

  
    const saveOutfit = async () => {
        if (selectedItems.length === 0 || !outfitName) {
            alert("Please select items and name the outfit.");
            return;
        }

        const newOutfit = { name: outfitName, items: selectedItems.map(item => item._id) };

        try {
            const response = await fetch("http://localhost:5000/api/outfits/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newOutfit),
            });

            if (response.ok) {
                alert("Outfit saved! ✅");
                window.location.href = "/outfit-history";
            } else {
                alert("Error saving outfit.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to connect to the backend.");
        }
    };

    return (
        <div className="auth-container">
            <h2>Log an Outfit</h2>

            <input
                type="text"
                placeholder="Outfit Name"
                value={outfitName}
                onChange={(e) => setOutfitName(e.target.value)}
                className="auth-input"
            />

            <button onClick={() => setShowPopup(true)} className="auth-button">🛍️ Select Items</button>

            <div className="selected-container">
                {selectedItems.length > 0 ? (
                    selectedItems.map((item) => (
                        <div key={item._id} className="selected-item">
                            <img src={item.image || "https://via.placeholder.com/100"} alt={item.name} className="closet-image" />
                            <p>{item.name}</p>
                        </div>
                    ))
                ) : (
                    <p>No items selected.</p>
                )}
            </div>

            <button onClick={saveOutfit} className="auth-button save-button">💾 Save Outfit</button>

            {showPopup && (
                <div className="popup">
                    <h3>Select Clothing Items</h3>
                    <div className="popup-content">
                        {clothingItems.length > 0 ? (
                            clothingItems.map((item) => (
                                <div
                                    key={item._id}
                                    onClick={() => toggleSelection(item)}
                                    className={`clothing-item ${selectedItems.some(selected => selected._id === item._id) ? "selected" : ""}`}
                                >
                                    <img src={item.image || "https://via.placeholder.com/100"} alt={item.name} className="closet-image" />
                                    <h4>{item.name}</h4>
                                </div>
                            ))
                        ) : (
                            <p>No clothing items available. Add clothes first!</p>
                        )}
                    </div>
                    <button onClick={() => setShowPopup(false)} className="auth-button close-button">✅ Done</button>
                </div>
            )}
        </div>
    );
};

export default LogOutfit;
