const express = require("express");
const router = express.Router();
const { db, storage } = require("../firebase"); // ✅ Import Firebase Firestore & Storage
const { collection, addDoc, getDocs, doc, deleteDoc, query, where } = require("firebase/firestore");
const { ref, deleteObject } = require("firebase/storage");

// ✅ Add Clothing Item (Firestore)
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
            image, // ✅ Firebase Storage Image URL
            createdAt: new Date(),
        };

        const docRef = await addDoc(collection(db, "clothing"), newItem);
        res.status(201).json({ id: docRef.id, ...newItem });
    } catch (error) {
        console.error("❌ Error adding item:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ✅ Get All Clothing Items (Firestore)
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

// ✅ Delete Clothing Item (Firestore)
router.delete("/items/:id", async (req, res) => {
    try {
        const itemId = req.params.id;
        const clothingRef = doc(db, "clothing", itemId);

        // Delete item from Firestore
        await deleteDoc(clothingRef);

        // ✅ Find associated outfits and remove item references
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
