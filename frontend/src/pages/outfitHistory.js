import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { 
    collection, 
    onSnapshot, 
    doc, 
    deleteDoc 
} from "firebase/firestore";
import "../styles.css"; // ✅ Import global styles

const OutfitHistory = () => {
    const [outfits, setOutfits] = useState([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "outfits"), (snapshot) => {
            const outfitData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            setOutfits(outfitData);
        });

        return () => unsubscribe();
    }, []);

    const deleteOutfit = async (outfitId) => {
        if (!window.confirm("Are you sure you want to delete this outfit?")) return;

        try {
            await deleteDoc(doc(db, "outfits", outfitId));
            alert("🗑️ Outfit deleted successfully!");
        } catch (error) {
            console.error("❌ Error deleting outfit:", error);
        }
    };

    return (
        <div className="auth-container">
            <h2>📜 Outfit History</h2>

            {outfits.length > 0 ? (
                <div className="outfit-container">
                    {outfits.map((outfit) => (
                        <div key={outfit.id} className="outfit-card">
                            <h3>{outfit.name}</h3>
                            <button 
                                onClick={() => deleteOutfit(outfit.id)} 
                                className="auth-button"
                            >
                                🗑️ Delete Outfit
                            </button>
                            <div className="outfit-items">
                                {outfit.items && outfit.items.length > 0 ? (
                                    outfit.items.map((item) => (
                                        <div key={item.id} className="outfit-item">
                                            <img 
                                                src={item.image || "https://placehold.co/100"} 
                                                alt={item.name} 
                                            />
                                            <p>{item.name}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p>⚠️ No items in this outfit.</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="no-outfits">⚠️ No outfits found.</p>
            )}
        </div>
    );
};

export default OutfitHistory;
