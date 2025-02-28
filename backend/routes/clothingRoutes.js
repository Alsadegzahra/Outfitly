const express = require("express");
const router = express.Router();
const { db } = require("../firebase"); 
const { collection, addDoc, getDocs, doc, deleteDoc, query, where } = require("firebase-admin/firestore");


/**
 * @route POST /api/clothing/items
 * @desc Add a new clothing item to Firestore
 * @access Public
 *
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Clothing item details.
 * @param {string} req.body.name - Name of the clothing item.
 * @param {string} req.body.category - Category of the clothing item.
 * @param {string} req.body.color - Color of the clothing item.
 * @param {string} req.body.image - URL of the clothing item's image.
 * @param {Object} res - Express response object.
 * @returns {Object} - The newly created clothing item with its ID.
 */
router.post("/items", async (req, res) => {
    try {
        const { name, category, color, image } = req.body;

        if (!name || !category || !color || !image) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const newItem = {
            name,
            category,
            color,
            image,
            createdAt: new Date(),
        };

        const docRef = await addDoc(collection(db, "clothing"), newItem);
        res.status(201).json({ id: docRef.id, ...newItem });
    } catch (error) {
        console.error("❌ Error adding item:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

/**
 * @route GET /api/clothing
 * @desc Retrieve all clothing items from Firestore (with optional filtering)
 * @access Public
 *
 * @param {Object} req - Express request object.
 * @param {Object} req.query - Optional filters for retrieving clothing items.
 * @param {string} [req.query.category] - Filter by clothing category.
 * @param {string} [req.query.color] - Filter by clothing color.
 * @param {Object} res - Express response object.
 * @returns {Object[]} - List of clothing items.
 */
router.get("/", async (req, res) => {
    try {
        const { category, color } = req.query;
        let clothingQuery = collection(db, "clothing");
        let filters = [];

        if (category) filters.push(where("category", "==", category));
        if (color) filters.push(where("color", "==", color));

        if (filters.length > 0) clothingQuery = query(clothingQuery, ...filters);

        const querySnapshot = await getDocs(clothingQuery);
        const clothingItems = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        res.json(clothingItems);
    } catch (error) {
        console.error("❌ Error fetching filtered clothing:", error);
        res.status(500).json({ error: "Error fetching clothing" });
    }
});

/**
 * @route DELETE /api/clothing/items/:id
 * @desc Delete a clothing item by ID and update associated outfits
 * @access Public
 *
 * @param {Object} req - Express request object.
 * @param {Object} req.params - Request parameters.
 * @param {string} req.params.id - ID of the clothing item to delete.
 * @param {Object} res - Express response object.
 * @returns {Object} - Confirmation message.
 */
router.delete("/items/:id", async (req, res) => {
    try {
        const itemId = req.params.id;
        const clothingRef = doc(db, "clothing", itemId);

        await deleteDoc(clothingRef);

        const outfitQuerySnapshot = await getDocs(query(collection(db, "outfits"), where("items", "array-contains", itemId)));
        outfitQuerySnapshot.forEach(async (outfitDoc) => {
            const outfitData = outfitDoc.data();
            const updatedItems = outfitData.items.filter(id => id !== itemId);
            await updateDoc(doc(db, "outfits", outfitDoc.id), { items: updatedItems });
        });

        res.json({ message: "Item deleted and outfits updated" });
    } catch (error) {
        console.error("❌ Error deleting item:", error);
        res.status(500).json({ error: "Error deleting item" });
    }
});

module.exports = router;
