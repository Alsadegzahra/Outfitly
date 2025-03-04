const express = require("express");
const router = express.Router();
const { db } = require("../firebase");
const { query, where } = require("firebase-admin/firestore");

/**
 * @route POST /api/clothing/items
 * @desc Add a new clothing item to Firestore
 * @access Public
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

        const docRef = await db.collection("clothing").add(newItem);
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
 */
router.get("/", async (req, res) => {
    try {
        const { category, color } = req.query;
        let clothingQuery = db.collection("clothing");

        if (category) clothingQuery = clothingQuery.where("category", "==", category);
        if (color) clothingQuery = clothingQuery.where("color", "==", color);

        const querySnapshot = await clothingQuery.get();
        const clothingItems = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        res.json(clothingItems);
    } catch (error) {
        console.error("❌ Error fetching clothing:", error);
        res.status(500).json({ error: "Error fetching clothing" });
    }
});

/**
 * @route DELETE /api/clothing/items/:id
 * @desc Delete a clothing item by ID and update associated outfits
 * @access Public
 */
router.delete("/items/:id", async (req, res) => {
    try {
        const itemId = req.params.id;

        await db.collection("clothing").doc(itemId).delete();

        const outfitQuerySnapshot = await db.collection("outfits").where("items", "array-contains", itemId).get();
        outfitQuerySnapshot.forEach(async (outfitDoc) => {
            const outfitData = outfitDoc.data();
            const updatedItems = outfitData.items.filter(id => id !== itemId);
            await db.collection("outfits").doc(outfitDoc.id).update({ items: updatedItems });
        });

        res.json({ message: "Item deleted and outfits updated" });
    } catch (error) {
        console.error("❌ Error deleting item:", error);
        res.status(500).json({ error: "Error deleting item" });
    }
});

module.exports = router;
