import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../styles.css";

/**
 * LogOutfit component that allows users to log and save outfits.
 * @returns {JSX.Element} The rendered LogOutfit component.
 */
const LogOutfit = () => {
    const [clothingItems, setClothingItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [outfitName, setOutfitName] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "clothing"), (querySnapshot) => {
            const clothingData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setClothingItems(clothingData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    /**
     * Toggles selection of a clothing item.
     * @param {Object} item - The clothing item object.
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
     * Saves the selected outfit to Firestore.
     */
    const saveOutfit = async () => {
        if (selectedItems.length === 0 || !outfitName) {
            alert("Please select items and name the outfit.");
            return;
        }

        setIsSaving(true);

        const newOutfit = { 
            name: outfitName, 
            items: selectedItems.map(item => ({
                id: item.id,
                name: item.name,
                image: item.image || "https://placehold.co/100"
            })), 
            createdAt: new Date().toISOString()
        };

        try {
            await addDoc(collection(db, "outfits"), newOutfit);

            setOutfitName("");
            setSelectedItems([]);

            setShowSuccessMessage(true);
            setIsSaving(false);

            setTimeout(() => {
                setShowSuccessMessage(false);
                navigate("/outfit-history");
            }, 1500);
        } catch (error) {
            console.error("Error saving outfit:", error);
            alert("Error saving outfit.");
            setIsSaving(false);
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

            <button onClick={() => setShowPopup(true)} className="auth-button">Select Items</button>

            <div className="selected-container">
                {selectedItems.length > 0 ? (
                    selectedItems.map((item) => (
                        <div key={item.id} className="selected-item">
                            <img 
                                src={item.image || "https://placehold.co/100"} 
                                alt={item.name} 
                                className="closet-image" 
                            />
                            <p>{item.name}</p>
                        </div>
                    ))
                ) : (
                    <p>No items selected.</p>
                )}
            </div>

            <button 
                onClick={saveOutfit} 
                className="auth-button save-button" 
                disabled={isSaving} 
                style={{ opacity: isSaving ? 0.5 : 1 }}
            >
                {isSaving ? "Saving..." : "Save Outfit"}
            </button>

            {showPopup && (
                <div className="popup">
                    <h3>Select Clothing Items</h3>
                    <div className="popup-content">
                        {loading ? (
                            <p>Loading items...</p>
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
                            <p>No clothing items available. Add clothes first!</p>
                        )}
                    </div>
                    <button onClick={() => setShowPopup(false)} className="auth-button close-button">Done</button>
                </div>
            )}

            {showSuccessMessage && (
                <div className="success-popup">
                    <p>Outfit saved successfully!</p>
                </div>
            )}
        </div>
    );
};

export default LogOutfit;
