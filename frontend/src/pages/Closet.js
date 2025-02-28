import React, { useState, useEffect } from "react";
import { db } from "../firebase"; 
import { 
    collection, 
    onSnapshot, 
    doc, 
    updateDoc, 
    deleteDoc, 
    getDocs, 
    query, 
    where 
} from "firebase/firestore";
import "../styles.css"; // ✅ Import global styles

const Closet = () => {
    const [clothing, setClothing] = useState([]);
    const [editItem, setEditItem] = useState(null);
    const [newCategory, setNewCategory] = useState("");
    const [newColor, setNewColor] = useState("");

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "clothing"), (snapshot) => {
            const clothingData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setClothing(clothingData);
        });

        return () => unsubscribe();
    }, []);

    // ✅ Edit Clothing Item (Updates Firestore & Outfits)
    const editClothingItem = async (itemId) => {
        if (!newCategory && !newColor) return alert("Please enter a new category or color.");

        try {
            const itemRef = doc(db, "clothing", itemId);
            const updates = {};
            if (newCategory) updates.category = newCategory;
            if (newColor) updates.color = newColor;

            await updateDoc(itemRef, updates);

            // ✅ Update outfits that contain this item
            const outfitQuery = query(collection(db, "outfits"), where("items", "array-contains", itemId));
            const outfitSnapshot = await getDocs(outfitQuery);

            outfitSnapshot.forEach(async (outfitDoc) => {
                const outfitRef = doc(db, "outfits", outfitDoc.id);
                const updatedItems = outfitDoc.data().items.map(item =>
                    item === itemId ? { ...item, ...updates } : item
                );

                await updateDoc(outfitRef, { items: updatedItems });
            });

            alert("✅ Clothing updated successfully!");
            setEditItem(null);
            setNewCategory("");
            setNewColor("");
        } catch (error) {
            console.error("❌ Error updating clothing:", error);
        }
    };

    // ❌ Delete Clothing Item & Remove Related Outfits
    const deleteClothingItem = async (itemId) => {
        if (!window.confirm("Are you sure you want to delete this item? This will also delete any outfits that used it!")) return;

        try {
            await deleteDoc(doc(db, "clothing", itemId));

            const outfitQuery = query(collection(db, "outfits"), where("items", "array-contains", itemId));
            const outfitSnapshot = await getDocs(outfitQuery);

            outfitSnapshot.forEach(async (outfitDoc) => {
                const outfitRef = doc(db, "outfits", outfitDoc.id);
                await deleteDoc(outfitRef);
            });

            alert("🗑️ Item and all outfits that used it have been deleted!");
        } catch (error) {
            console.error("❌ Error deleting clothing and outfits:", error);
        }
    };

    return (
        <div className="closet-container">
            <h2>👗 My Closet</h2>

            <div className="card-container">
                {clothing.length > 0 ? (
                    clothing.map((item) => (
                        <div key={item.id} className="card-item">
                            <img 
                                src={item.image || "https://placehold.co/150?text=No+Image"} 
                                alt={item.name} 
                                className="closet-image"
                            />
                            <p><strong>{item.name}</strong></p>
                            <p>{item.category} - {item.color}</p>

                            {/* ✏️ Edit Button */}
                            <button onClick={() => setEditItem(item)} className="edit-button">✏️ Edit</button>

                            {/* ❌ Delete Button */}
                            <button onClick={() => deleteClothingItem(item.id)} className="delete-button">🗑️ Delete</button>

                            {/* Edit Form */}
                            {editItem?.id === item.id && (
                                <div className="edit-form">
                                    <input
                                        type="text"
                                        placeholder="New Category"
                                        value={newCategory}
                                        onChange={(e) => setNewCategory(e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        placeholder="New Color"
                                        value={newColor}
                                        onChange={(e) => setNewColor(e.target.value)}
                                    />
                                    <button onClick={() => editClothingItem(item.id)} className="primary-button">✅ Save</button>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="no-items">⚠️ No clothing items found.</p>
                )}
            </div>
        </div>
    );
};

export default Closet;
