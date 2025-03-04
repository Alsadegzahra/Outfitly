import React, { useState } from "react";
import { storage, db } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import "../styles.css";

/**
 * Component for adding clothing items to the closet.
 * @returns {JSX.Element} The rendered AddClothing component.
 */
const AddClothing = () => {
    const [clothingName, setClothingName] = useState("");
    const [clothingCategory, setClothingCategory] = useState("");
    const [clothingColor, setClothingColor] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [uploading, setUploading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const categories = ["Top", "Bottom", "Shoes", "Outerwear", "Accessories", "Dress", "Activewear", "Sleepwear"];
    const colors = ["Red", "Blue", "Green", "Black", "White", "Yellow", "Purple", "Pink", "Orange", "Gray", "Brown", "Beige"];

    /**
     * Handles image file selection and updates the preview.
     * @param {Event} e - The event object.
     */
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    /**
     * Uploads the selected image to Firebase Storage.
     * @returns {Promise<string|null>} The download URL of the uploaded image, or null if no image is uploaded.
     */
    const uploadImageToFirebase = async () => {
        if (!imageFile) return null;

        setUploading(true);
        const storageRef = ref(storage, `clothing/${uuidv4()}-${imageFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);

        return new Promise((resolve, reject) => {
            uploadTask.on(
                "state_changed",
                null,
                (error) => {
                    console.error("Upload failed", error);
                    setUploading(false);
                    reject(error);
                },
                async () => {
                    const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
                    setUploading(false);
                    resolve(downloadUrl);
                }
            );
        });
    };

    /**
     * Adds a new clothing item to Firestore, including optional image upload.
     */
    const addClothing = async () => {
        if (!clothingName || !clothingCategory || !clothingColor) {
            setErrorMessage("Please fill in all required fields.");
            return;
        }
        setErrorMessage("");

        try {
            const imageUrl = imageFile ? await uploadImageToFirebase() : "https://placehold.co/150?text=No+Image";

            const newClothingItem = {
                name: clothingName,
                category: clothingCategory,
                color: clothingColor,
                image: imageUrl,
                createdAt: new Date().toISOString(),
            };

            await addDoc(collection(db, "clothing"), newClothingItem);

            setSuccessMessage("Clothing added successfully!");
            setTimeout(() => setSuccessMessage(""), 3000);

            setClothingName("");
            setClothingCategory("");
            setClothingColor("");
            setImagePreview(null);
            setImageFile(null);

            document.getElementById("category-select").selectedIndex = 0;
            document.getElementById("color-select").selectedIndex = 0;
        } catch (error) {
            console.error("Firestore Write Error:", error);
            setErrorMessage(`Error: ${error.message}`);
        }
    };

    return (
        <div className="auth-container">
            <h2>Add Clothing</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
            <input
                type="text"
                placeholder="Clothing Name *"
                value={clothingName}
                onChange={(e) => setClothingName(e.target.value)}
                className="auth-input"
                required
            />
            <select id="category-select" value={clothingCategory} onChange={(e) => setClothingCategory(e.target.value)} className="auth-input" required>
                <option value="">Select Category *</option>
                {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>
            <select id="color-select" value={clothingColor} onChange={(e) => setClothingColor(e.target.value)} className="auth-input" required>
                <option value="">Select Color *</option>
                {colors.map((color) => (
                    <option key={color} value={color}>{color}</option>
                ))}
            </select>
            <label className="file-upload">
                Upload Image (Optional)
                <input type="file" accept="image/*" onChange={handleImageChange} />
            </label>
            {imagePreview && (
                <div className="image-preview">
                    <img src={imagePreview} alt="Clothing Preview" />
                </div>
            )}
            <button onClick={addClothing} className="primary-button" disabled={uploading}>
                {uploading ? "Uploading..." : "Add Clothing"}
            </button>
        </div>
    );
};

export default AddClothing;
