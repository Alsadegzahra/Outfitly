const express = require("express");
const router = express.Router();
const { db } = require("../firebase"); 
const { collection, getDocs, query, where } = require("firebase-admin/firestore");

/**
 * @route GET /api/search
 * @desc Search for clothing items and outfits in Firestore based on query and filters
 * @access Public
 *
 * @param {Object} req - Express request object.
 * @param {string} [req.query.q] - Search query string.
 * @param {string} [req.query.category] - Filter by clothing category.
 * @param {string} [req.query.color] - Filter by clothing color.
 * @param {Object} res - Express response object.
 * @returns {Object} - Object containing matching clothing items and outfits.
 */
router.get("/", async (req, res) => {
    try {
        const searchQuery = req.query.q || "";
        const { category, color } = req.query;

        console.log("🔍 Search Query:", searchQuery, "🛍️ Filters:", { category, color });

        let clothingQuery = collection(db, "clothing");
        let clothingFilters = [];

        if (searchQuery.trim()) clothingFilters.push(where("name", ">=", searchQuery));
        if (category) clothingFilters.push(where("category", "==", category));
        if (color) clothingFilters.push(where("color", "==", color));

        if (clothingFilters.length > 0) clothingQuery = query(clothingQuery, ...clothingFilters);

        const clothingSnapshot = await getDocs(clothingQuery);
        const clothingItems = clothingSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        const outfitQuery = collection(db, "outfits");
        const outfitSnapshot = await getDocs(outfitQuery);

        const outfits = await Promise.all(
            outfitSnapshot.docs.map(async (outfitDoc) => {
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

                if (searchQuery.trim() && !outfit.name.toLowerCase().includes(searchQuery.toLowerCase())) {
                    return null;
                }

                return { id: outfitDoc.id, name: outfit.name, items: filteredItems };
            })
        );

        res.json({ clothing: clothingItems, outfits: outfits.filter(outfit => outfit) });
    } catch (error) {
        console.error("❌ Error searching:", error);
        res.status(500).json({ error: "Error searching" });
    }
});

module.exports = router;
