import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddClothing = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [color, setColor] = useState("");
    const [image, setImage] = useState("");
    const [message, setMessage] = useState(""); // Success message

    // Function to handle image upload and convert to Base64
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result); // Store the image as Base64
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
                setName(""); // Clear form fields
                setCategory("");
                setColor("");
                setImage("");
            } else {
                alert("Error adding clothing.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to connect to the backend.");
        }
    };

    return (
        <div style={styles.container}>
            <button onClick={() => navigate("/")} style={styles.homeButton}>🏠 Home</button>
            <h2>Add Clothing</h2>

            {/* Success Message */}
            {message && <p style={styles.successMessage}>{message}</p>}

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

                <label>Upload Image (Optional):</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} />

                {/* Show Image Preview */}
                {image && <img src={image} alt="Preview" style={styles.imagePreview} />}

                <button type="submit">Add Clothing</button>
            </form>
        </div>
    );
};

const styles = {
    container: { textAlign: "center", padding: "20px" },
    homeButton: { margin: "10px", padding: "10px", fontSize: "16px", cursor: "pointer" },
    form: { display: "inline-block", textAlign: "left" },
    imagePreview: { marginTop: "10px", width: "100px", borderRadius: "5px" },
    successMessage: { color: "green", fontWeight: "bold" },
};

export default AddClothing;
