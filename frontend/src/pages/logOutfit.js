import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LogOutfit = () => {
    const navigate = useNavigate();
    const [clothingItems, setClothingItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [outfitName, setOutfitName] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    // ✅ Fetch wardrobe items and filter out deleted clothing
    useEffect(() => {
        fetch("http://localhost:5000/api/clothing")
            .then(response => response.json())
            .then(data => {
                const validItems = data.filter(item => item !== null); // Ensure no deleted items exist
                setClothingItems(validItems);
            })
            .catch(error => console.error("Error fetching wardrobe:", error));
    }, []);

    // Toggle selection in the popup
    const toggleSelection = (item) => {
        if (selectedItems.some(selected => selected._id === item._id)) {
            setSelectedItems(selectedItems.filter(selected => selected._id !== item._id));
        } else {
            setSelectedItems([...selectedItems, item]);
        }
    };

    // Save outfit
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
                alert("Outfit saved!");
                navigate("/outfit-history");
            } else {
                alert("Error saving outfit.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to connect to the backend.");
        }
    };

    return (
        <div style={styles.container}>
            <button onClick={() => navigate("/")} style={styles.homeButton}>🏠 Home</button>
            <h2>Log an Outfit</h2>

            <input
                type="text"
                placeholder="Outfit Name"
                value={outfitName}
                onChange={(e) => setOutfitName(e.target.value)}
                style={styles.input}
            />

            <button onClick={() => setShowPopup(true)} style={styles.selectButton}>🛍️ Select Items</button>

            {/* Show selected items */}
            <div style={styles.selectedContainer}>
                {selectedItems.length > 0 ? (
                    selectedItems.map((item) => (
                        <div key={item._id} style={styles.selectedItem}>
                            <img src={item.image || "https://via.placeholder.com/100"} alt={item.name} style={styles.image} />
                            <p>{item.name}</p>
                        </div>
                    ))
                ) : (
                    <p>No items selected.</p>
                )}
            </div>

            <button onClick={saveOutfit} style={styles.saveButton}>💾 Save Outfit</button>

            {/* Popup for selecting clothing */}
            {showPopup && (
                <div style={styles.popup}>
                    <h3>Select Clothing Items</h3>
                    <div style={styles.popupContent}>
                        {clothingItems.length > 0 ? (
                            clothingItems.map((item) => (
                                <div
                                    key={item._id}
                                    onClick={() => toggleSelection(item)}
                                    style={{
                                        ...styles.clothingItem,
                                        border: selectedItems.some(selected => selected._id === item._id) ? "2px solid blue" : "1px solid #ddd",
                                    }}
                                >
                                    <img src={item.image || "https://via.placeholder.com/100"} alt={item.name} style={styles.image} />
                                    <h4>{item.name}</h4>
                                </div>
                            ))
                        ) : (
                            <p>No clothing items available. Add clothes first!</p>
                        )}
                    </div>
                    <button onClick={() => setShowPopup(false)} style={styles.closeButton}>✅ Done</button>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: { textAlign: "center", padding: "20px" },
    homeButton: { margin: "10px", padding: "10px", fontSize: "16px", cursor: "pointer" },
    input: { margin: "10px", padding: "10px", width: "60%", fontSize: "16px" },
    selectButton: { margin: "10px", padding: "10px", fontSize: "16px", cursor: "pointer", backgroundColor: "#007bff", color: "white" },
    selectedContainer: { display: "flex", flexWrap: "wrap", justifyContent: "center", marginTop: "20px" },
    selectedItem: { margin: "10px", padding: "10px", textAlign: "center", width: "100px" },
    saveButton: { marginTop: "20px", padding: "10px", fontSize: "16px", cursor: "pointer", backgroundColor: "green", color: "white" },
    popup: { position: "fixed", top: "20%", left: "50%", transform: "translate(-50%, -20%)", backgroundColor: "white", padding: "20px", boxShadow: "0px 4px 6px rgba(0,0,0,0.1)", textAlign: "center" },
    popupContent: { display: "flex", flexWrap: "wrap", justifyContent: "center" },
    clothingItem: { cursor: "pointer", margin: "10px", padding: "10px", textAlign: "center", width: "120px" },
    image: { width: "100%", borderRadius: "5px" },
    closeButton: { marginTop: "10px", padding: "10px", fontSize: "16px", cursor: "pointer", backgroundColor: "#007bff", color: "white" },
};

export default LogOutfit;
