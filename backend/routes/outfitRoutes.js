const express = require("express");
const router = express.Router();
const { db } = require("../firebase"); 
const { collection, addDoc, getDocs, doc, deleteDoc, query, where } = require("firebase-admin/firestore");

/**
 * @route POST /api/outfits
 * @desc Create a new outfit in Firestore
 * @access Public
 */
router.post("/", async (req, res) => {
    try {
        console.log("\ud83d\udce9 Received Outfit Data:", req.body);

        const { name, items } = req.body;

        if (!name || !items || !Array.isArray(items)) {
            console.log("\u274c Missing required fields:", { name, items });
            return res.status(400).json({ error: "Missing required fields" });
        }

        const newOutfit = { name, items, createdAt: new Date() };
        const docRef = await db.collection("outfits").add(newOutfit);

        console.log("\u2705 Outfit saved successfully:", newOutfit);
        res.status(201).json({ id: docRef.id, ...newOutfit });
    } catch (error) {
        console.error("\u274c Error saving outfit:", error);
        res.status(500).json({ error: "Error saving outfit" });
    }
});

/**
 * @route GET /api/outfits
 * @desc Retrieve all outfits from Firestore
 * @access Public
 */
router.get("/", async (req, res) => {
    try {
        const { category, color } = req.query;
        const outfitQuery = await db.collection("outfits").get();
        
        const outfitData = await Promise.all(
            outfitQuery.docs.map(async (outfitDoc) => {
                const outfit = outfitDoc.data();
                const itemRefs = outfit.items || [];

                const itemData = await Promise.all(
                    itemRefs.map(async (itemId) => {
                        const itemDoc = await db.collection("clothing").where("id", "==", itemId).get();
                        return itemDoc.docs.length > 0 ? { id: itemId, ...itemDoc.docs[0].data() } : null;
                    })
                );

                let filteredItems = itemData.filter(item => item);
                if (category) filteredItems = filteredItems.filter(item => item.category === category);
                if (color) filteredItems = filteredItems.filter(item => item.color === color);

                return { id: outfitDoc.id, name: outfit.name, items: filteredItems };
            })
        );

        res.json(outfitData);
    } catch (error) {
        console.error("\u274c Error fetching outfits:", error);
        res.status(500).json({ error: "Error fetching outfits" });
    }
});

/**
 * @route DELETE /api/outfits/:id
 * @desc Delete an outfit by ID from Firestore
 * @access Public
 */
router.delete("/:id", async (req, res) => {
    try {
        const outfitId = req.params.id;
        await db.collection("outfits").doc(outfitId).delete();
        res.json({ message: "Outfit deleted successfully" });
    } catch (error) {
        console.error("\u274c Error deleting outfit:", error);
        res.status(500).json({ error: "Error deleting outfit" });
    }
});

module.exports = router;

afterAll(() => {
    jest.clearAllMocks();  // Clears mock functions
});
