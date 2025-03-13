import React, { useState, useEffect } from "react";
import { db } from "../firebase"; 
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import "../styles.css";

const categories = ["Top", "Bottom", "Shoes", "Outerwear", "Accessories", "Dress", "Activewear", "Sleepwear"];
const colors = ["Red", "Blue", "Green", "Black", "White", "Yellow", "Purple", "Pink", "Orange", "Gray", "Brown", "Beige"];

/**
 * Component that displays and manages the user's clothing collection.
 * Users can edit or delete clothing items.
 * @returns {JSX.Element} The rendered Closet component.
 */
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

    /**
     * Toggles the edit form for a selected clothing item.
     * @param {Object} item - The clothing item to edit.
     */
    const toggleEditForm = (item) => {
        if (editItem?.id === item.id) {
            setEditItem(null);
            setNewCategory("");
            setNewColor("");
        } else {
            setEditItem(item);
            setNewCategory(item.category || "");
            setNewColor(item.color || "");
        }
    };

    /**
     * Updates a clothing item in Firestore with the new category or color.
     * @param {string} itemId - The ID of the clothing item to update.
     */
    const editClothingItem = async (itemId) => {
        if (!newCategory && !newColor) return alert("Please select a category or color.");

        try {
            const itemRef = doc(db, "clothing", itemId);
            const updates = {};
            if (newCategory) updates.category = newCategory;
            if (newColor) updates.color = newColor;

            await updateDoc(itemRef, updates);

            alert("Clothing updated successfully!");
            setEditItem(null);
            setNewCategory("");
            setNewColor("");
        } catch (error) {
            console.error("Error updating clothing:", error);
        }
    };

    /**
     * Deletes a clothing item from Firestore.
     * @param {string} itemId - The ID of the clothing item to delete.
     */
    const deleteClothingItem = async (itemId) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;

        try {
            await deleteDoc(doc(db, "clothing", itemId));
            alert("Item deleted successfully!");
        } catch (error) {
            console.error("Error deleting clothing:", error);
        }
    };

    return (
        <div className="closet-container">
            <h2>My Closet</h2>
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

                            <button onClick={() => toggleEditForm(item)} className="edit-button">
                                {editItem?.id === item.id ? "Cancel" : "Edit"}
                            </button>
                            <button onClick={() => deleteClothingItem(item.id)} className="delete-button">Delete</button>

                            {editItem?.id === item.id && (
                                <div className="edit-form">
                                    <label>Category</label>
                                    <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
                                        <option value="">Select Category</option>
                                        {categories.map((category) => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>

                                    <label>Color</label>
                                    <select value={newColor} onChange={(e) => setNewColor(e.target.value)}>
                                        <option value="">Select Color</option>
                                        {colors.map((color) => (
                                            <option key={color} value={color}>{color}</option>
                                        ))}
                                    </select>

                                    <button onClick={() => editClothingItem(item.id)} className="save-button">Save</button>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="no-items">No clothing items found.</p>
                )}
            </div>
        </div>
    );
};

export default Closet;
