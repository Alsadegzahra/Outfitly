const express = require("express");
const router = express.Router();
const { getFirestore } = require("firebase-admin/firestore");

// Initialize Firestore
const db = getFirestore();

/**
 * @route GET /api/search
 * @desc Search for clothing items and outfits in Firestore based on query and filters
 * @access Public
 */
router.get("/", async (req, res) => {
    try {
        const searchQuery = req.query.q || "";
        const { category, color } = req.query;

        console.log("🔍 Search Query:", searchQuery, "🛍️ Filters:", { category, color });

        // 🔹 Build Clothing Query
        let clothingRef = db.collection("clothing");
        let clothingQuery = clothingRef;

        if (searchQuery.trim()) clothingQuery = clothingQuery.where("name", ">=", searchQuery);
        if (category) clothingQuery = clothingQuery.where("category", "==", category);
        if (color) clothingQuery = clothingQuery.where("color", "==", color);

        const clothingSnapshot = await clothingQuery.get();
        const clothingItems = clothingSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        // 🔹 Get Outfits & Filter
        const outfitSnapshot = await db.collection("outfits").get();

        const outfits = await Promise.all(
            outfitSnapshot.docs.map(async (outfitDoc) => {
                const outfit = outfitDoc.data();
                const itemRefs = outfit.items || [];

                const itemData = await Promise.all(
                    itemRefs.map(async (itemId) => {
                        const itemQuery = await db.collection("clothing").where("id", "==", itemId).get();
                        return itemQuery.docs.length > 0 ? { id: itemId, ...itemQuery.docs[0].data() } : null;
                    })
                );

                let filteredItems = itemData.filter(item => item);
                if (category) filteredItems = filteredItems.filter(item => item.category === category);
                if (color) filteredItems = filteredItems.filter(item => item.color === color);

                if (searchQuery.trim() && !outfit.name.toLowerCase().includes(searchQuery.toLowerCase())) {
                    return null;
                }

                return { id: outfitDoc.id, name: outfit.name, items: filteredItems };
            })
        );

        res.json({ clothing: clothingItems, outfits: outfits.filter(outfit => outfit) });
    } catch (error) {
        console.error("❌ Error searching:", error);
        res.status(500).json({ error: "Error searching Firestore" });
    }
});

module.exports = router;
