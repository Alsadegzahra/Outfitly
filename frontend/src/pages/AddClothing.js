import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddClothing = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [color, setColor] = useState("");
    const [image, setImage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name || !category || !color) {
            alert("Please fill out all required fields!");
            return;
        }

        const newItem = { id: Date.now(), name, category, color, image };
        const storedClothing = JSON.parse(localStorage.getItem("clothingItems")) || [];
        const updatedClothing = [...storedClothing, newItem];

        localStorage.setItem("clothingItems", JSON.stringify(updatedClothing));

        navigate("/"); // Redirect to home after adding clothing
    };

    return (
        <div style={styles.container}>
            <button onClick={() => navigate("/")} style={styles.homeButton}>🏠 Home</button>
            <h2>Add Clothing</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <label>Clothing Name:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

                <label>Category:</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                    <option value="">Select a category</option>
                    <option value="Top">Top</option>
                    <option value="Bottom">Bottom</option>
                    <option value="Shoes">Shoes</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Outerwear">Outerwear</option>
                </select>

                <label>Color:</label>
                <select value={color} onChange={(e) => setColor(e.target.value)} required>
                    <option value="">Select a color</option>
                    <option value="Red">Red</option>
                    <option value="Blue">Blue</option>
                    <option value="Green">Green</option>
                    <option value="Black">Black</option>
                    <option value="White">White</option>
                    <option value="Gray">Gray</option>
                    <option value="Yellow">Yellow</option>
                    <option value="Pink">Pink</option>
                    <option value="Purple">Purple</option>
                    <option value="Brown">Brown</option>
                </select>

                <label>Image URL (Optional):</label>
                <input type="text" value={image} onChange={(e) => setImage(e.target.value)} />

                <button type="submit">Add Clothing</button>
                <button type="button" onClick={() => navigate("/")}>Cancel</button>
            </form>
        </div>
    );
};

const styles = {
    container: {
        textAlign: "center",
        padding: "20px",
    },
    homeButton: {
        margin: "10px",
        padding: "10px",
        fontSize: "16px",
        cursor: "pointer",
    },
    form: {
        display: "inline-block",
        textAlign: "left",
    },
};

export default AddClothing;
