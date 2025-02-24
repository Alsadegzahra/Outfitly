import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Closet = () => {
    const navigate = useNavigate();
    const [clothingItems, setClothingItems] = useState([]);

    // ✅ Fetch wardrobe items from backend
    useEffect(() => {
        fetch("http://localhost:5000/api/clothing")
            .then(response => response.json())
            .then(data => setClothingItems(data))
            .catch(error => console.error("Error fetching wardrobe:", error));
    }, []);

    // ✅ Function to delete clothing item
    const deleteClothingItem = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this item?");
        if (!confirmDelete) return;

        // ✅ Optimistically update UI before backend response
        setClothingItems(prevItems => prevItems.filter(item => item._id !== id));

        try {
            const response = await fetch(`http://localhost:5000/api/clothing/delete/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete item.");
            }
        } catch (error) {
            alert("Error deleting clothing item.");
            console.error("Error:", error);

            // ❌ Revert UI if deletion fails
            setClothingItems(prevItems => [...prevItems, clothingItems.find(item => item._id === id)]);
        }
    };

    return (
        <div>
            <button onClick={() => navigate("/")} style={styles.homeButton}>🏠 Home</button>
            <h2>My Wardrobe</h2>
            <div style={styles.clothingContainer}>
                {clothingItems.length > 0 ? (
                    clothingItems.map((item) => (
                        <div key={item._id} style={styles.clothingItem}>
                            <img src={item.image || "https://via.placeholder.com/150"} alt={item.name} style={styles.image} />
                            <h3>{item.name}</h3>
                            <p>Category: {item.category}</p>
                            <p>Color: {item.color}</p>
                            <button onClick={() => deleteClothingItem(item._id)} style={styles.deleteButton}>🗑️ Delete</button>
                        </div>
                    ))
                ) : (
                    <p>No clothing items yet. Add some!</p>
                )}
            </div>
        </div>
    );
};

const styles = {
    homeButton: { margin: "10px", padding: "10px", fontSize: "16px", cursor: "pointer" },
    clothingContainer: { display: "flex", flexWrap: "wrap", marginTop: "20px" },
    clothingItem: { border: "1px solid #ddd", margin: "10px", padding: "10px", width: "200px", textAlign: "center" },
    image: { width: "100%", borderRadius: "5px" },
    deleteButton: { backgroundColor: "red", color: "white", padding: "5px", border: "none", cursor: "pointer", marginTop: "5px" },
};

export default Closet;
