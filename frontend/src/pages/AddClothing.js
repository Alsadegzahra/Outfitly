import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css"; 

const AddClothing = () => {
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [color, setColor] = useState("");
    const [image, setImage] = useState("");
    const [message, setMessage] = useState(""); 

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !category || !color) {
            alert("Please fill out all required fields!");
            return;
        }

        const newItem = { name, category, color, image };

        try {
            const response = await fetch("http://localhost:5000/api/clothing/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newItem),
            });

            if (response.ok) {
                setMessage("Clothing item added successfully! ✅");
                setName(""); setCategory(""); setColor(""); setImage("");
            } else {
                alert("Error adding clothing.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to connect to the backend.");
        }
    };

    return (
        <div className="auth-container">
            <h2>Add Clothing</h2>

            {message && <p className="success-message">{message}</p>}

            <form onSubmit={handleSubmit}>
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

                <label>Upload Image (Optional):</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} />

                {image && <img src={image} alt="Preview" className="image-preview" />}

                <button type="submit">Add Clothing</button>
            </form>
        </div>
    );
};

export default AddClothing;
