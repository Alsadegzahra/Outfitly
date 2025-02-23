import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Closet = () => {
    const [clothingItems, setClothingItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const storedClothing = JSON.parse(localStorage.getItem("clothingItems")) || [];
        setClothingItems(storedClothing);
    }, []);

    return (
        <div>
            <button onClick={() => navigate("/")} style={{ margin: "10px", padding: "10px", fontSize: "16px" }}>
                🏠 Home
            </button>
            <h2>My Wardrobe</h2>
            <div style={{ display: "flex", flexWrap: "wrap", marginTop: "20px" }}>
                {clothingItems.length > 0 ? (
                    clothingItems.map((item) => (
                        <div key={item.id} style={{ border: "1px solid #ddd", margin: "10px", padding: "10px", width: "200px", textAlign: "center" }}>
                            <img src={item.image || "https://via.placeholder.com/150"} alt={item.name} style={{ width: "100%" }} />
                            <h3>{item.name}</h3>
                            <p>Category: {item.category}</p>
                            <p>Color: {item.color}</p>
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
