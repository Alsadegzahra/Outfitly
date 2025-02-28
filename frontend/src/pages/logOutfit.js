import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../styles.css";

/**
 * LogOutfit component allows users to log and save outfits by selecting clothing items.
 * 
 * @component
 * @returns {JSX.Element} - Rendered LogOutfit component.
 */
const LogOutfit = () => {
    const [clothingItems, setClothingItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [outfitName, setOutfitName] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        console.time("Firestore Fetch (LogOutfit)");
        
        const unsubscribe = onSnapshot(collection(db, "clothing"), (querySnapshot) => {
            const clothingData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setClothingItems(clothingData);
            setLoading(false);
            console.timeEnd("Firestore Fetch (LogOutfit)");
        });

        return () => unsubscribe();
    }, []);

    /**
     * Toggles selection of a clothing item.
     * 
     * @param {Object} item - Clothing item object.
     */
    const toggleSelection = (item) => {
        setSelectedItems((prev) => {
            const itemSet = new Set(prev.map(i => i.id));
            return itemSet.has(item.id)
                ? prev.filter(selected => selected.id !== item.id)
                : [...prev, item];
        });
    };

    /**
     * Saves an outfit to Firestore with selected clothing items.
     */
    const saveOutfit = async () => {
        if (selectedItems.length === 0 || !outfitName) {
            alert("❌ Please select items and name the outfit.");
            return;
        }

        const newOutfit = { 
            name: outfitName, 
            items: selectedItems.map(item => item.id), 
            createdAt: new Date().toISOString()
        };

        try {
            await addDoc(collection(db, "outfits"), newOutfit);
            alert("✅ Outfit saved successfully!");
            navigate("/outfit-history");
        } catch (error) {
            console.error("❌ Error saving outfit:", error);
            alert("Error saving outfit.");
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
                        <div key={item.id} className="selected-item">
                            <img src={item.image || "https://placehold.co/100"} alt={item.name} className="closet-image" />
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
                        {loading ? (
                            <p>⏳ Loading items...</p>
                        ) : clothingItems.length > 0 ? (
                            clothingItems.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => toggleSelection(item)}
                                    className={`clothing-item ${selectedItems.some(selected => selected.id === item.id) ? "selected" : ""}`}
                                >
                                    <img src={item.image || "https://placehold.co/100"} alt={item.name} className="closet-image" />
                                    <h4>{item.name}</h4>
                                </div>
                            ))
                        ) : (
                            <p>🛑 No clothing items available. Add clothes first!</p>
                        )}
                    </div>
                    <button onClick={() => setShowPopup(false)} className="auth-button close-button">✅ Done</button>
                </div>
            )}
        </div>
    );
};

export default LogOutfit;
