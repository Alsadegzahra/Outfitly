import React, { useEffect, useState } from "react";
import "../styles.css"; 

const Closet = () => {
    const [clothingItems, setClothingItems] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/clothing")
            .then(response => response.json())
            .then(data => setClothingItems(data))
            .catch(error => console.error("Error fetching wardrobe:", error));
    }, []);


    const deleteClothingItem = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this item?");
        if (!confirmDelete) return;


        setClothingItems(prevItems => prevItems.filter(item => item._id !== id));

        try {
            const response = await fetch(`http://localhost:5000/api/clothing/items/${id}`, {  // ✅ Correct route
            method: "DELETE"
            });

            if (!response.ok) {
                throw new Error("Failed to delete item.");
            }
        } catch (error) {
            alert("Error deleting clothing item.");
            console.error("Error:", error);

            setClothingItems(prevItems => [...prevItems, clothingItems.find(item => item._id === id)]);
        }
    };

    return (
        <div className="auth-container">
            <h2>My Wardrobe</h2>
            <div className="closet-container">
                {clothingItems.length > 0 ? (
                    clothingItems.map((item) => (
                        <div key={item._id} className="closet-item">
                            <img src={item.image || "/default-placeholder.png"} alt={item.name} className="closet-image" />
                            <h3>{item.name}</h3>
                            <p>Category: {item.category}</p>
                            <p>Color: {item.color}</p>
                            <button onClick={() => deleteClothingItem(item._id)} className="delete-button">🗑️ Delete</button>
                        </div>
                    ))
                ) : (
                    <p>No clothing items yet. Add some!</p>
                )}
            </div>
        </div>
    );
};

export default Closet;
