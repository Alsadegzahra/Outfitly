const express = require("express");
const router = express.Router();
const { db } = require("../firebase"); 
const { collection, addDoc, getDocs, doc, deleteDoc, query, where } = require("firebase-admin/firestore");

/**
 * @route POST /api/outfits
 * @desc Create a new outfit in Firestore
 * @access Public
 *
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Outfit details.
 * @param {string} req.body.name - Name of the outfit.
 * @param {string[]} req.body.items - Array of clothing item IDs.
 * @param {Object} res - Express response object.
 * @returns {Object} - The newly created outfit with its ID.
 */
router.post("/", async (req, res) => {
    try {
        console.log("📩 Received Outfit Data:", req.body);

        const { name, items } = req.body;

        if (!name || !items || !Array.isArray(items)) {
            console.log("❌ Missing required fields:", { name, items });
            return res.status(400).json({ error: "Missing required fields" });
        }

        const newOutfit = { name, items, createdAt: new Date() };
        const docRef = await addDoc(collection(db, "outfits"), newOutfit);

        console.log("✅ Outfit saved successfully:", newOutfit);
        res.status(201).json({ id: docRef.id, ...newOutfit });
    } catch (error) {
        console.error("❌ Error saving outfit:", error);
        res.status(500).json({ error: "Error saving outfit" });
    }
});

/**
 * @route GET /api/outfits
 * @desc Retrieve all outfits from Firestore
 * @access Public
 *
 * @param {Object} req - Express request object.
 * @param {Object} req.query - Optional filters for retrieving outfits.
 * @param {string} [req.query.category] - Filter outfits by clothing category.
 * @param {string} [req.query.color] - Filter outfits by clothing color.
 * @param {Object} res - Express response object.
 * @returns {Object[]} - List of outfits with associated clothing items.
 */
router.get("/", async (req, res) => {
    try {
        const { category, color } = req.query;
        let outfitQuery = collection(db, "outfits");

        const querySnapshot = await getDocs(outfitQuery);
        const outfitData = await Promise.all(
            querySnapshot.docs.map(async (outfitDoc) => {
                const outfit = outfitDoc.data();
                const itemRefs = outfit.items || [];

                const itemData = await Promise.all(
                    itemRefs.map(async (itemId) => {
                        const itemDoc = await getDocs(query(collection(db, "clothing"), where("id", "==", itemId)));
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
        console.error("❌ Error fetching outfits:", error);
        res.status(500).json({ error: "Error fetching outfits" });
    }
});

/**
 * @route DELETE /api/outfits/:id
 * @desc Delete an outfit by ID from Firestore
 * @access Public
 *
 * @param {Object} req - Express request object.
 * @param {Object} req.params - Request parameters.
 * @param {string} req.params.id - ID of the outfit to delete.
 * @param {Object} res - Express response object.
 * @returns {Object} - Confirmation message.
 */
router.delete("/:id", async (req, res) => {
    try {
        const outfitId = req.params.id;
        const outfitRef = doc(db, "outfits", outfitId);

        await deleteDoc(outfitRef);
        res.json({ message: "Outfit deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting outfit:", error);
        res.status(500).json({ error: "Error deleting outfit" });
    }
});

module.exports = router;
