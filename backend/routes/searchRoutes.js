const express = require("express");
const router = express.Router();
const { db } = require("../firebase"); // ✅ Import Firestore
const { collection, getDocs, query, where } = require("firebase/firestore");

// ✅ Search for Clothing & Outfits in Firestore
router.get("/", async (req, res) => {
    try {
        const searchQuery = req.query.q || "";
        const { category, color } = req.query;

        console.log("🔍 Search Query:", searchQuery, "🛍️ Filters:", { category, color });

        // 🔹 Search Clothing in Firestore
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

        // 🔹 Search Outfits in Firestore
        const outfitQuery = collection(db, "outfits");
        const outfitSnapshot = await getDocs(outfitQuery);

        const outfits = await Promise.all(
            outfitSnapshot.docs.map(async (outfitDoc) => {
                const outfit = outfitDoc.data();
                const itemRefs = outfit.items || [];

                // Fetch clothing items for the outfit
                const itemData = await Promise.all(
                    itemRefs.map(async (itemId) => {
                        const itemDoc = await getDocs(query(collection(db, "clothing"), where("id", "==", itemId)));
                        return itemDoc.docs.length > 0 ? { id: itemId, ...itemDoc.docs[0].data() } : null;
                    })
                );

                // Apply category & color filters if provided
                let filteredItems = itemData.filter(item => item);
                if (category) filteredItems = filteredItems.filter(item => item.category === category);
                if (color) filteredItems = filteredItems.filter(item => item.color === color);

                // 🔍 Match outfits based on searchQuery
                if (searchQuery.trim() && !outfit.name.toLowerCase().includes(searchQuery.toLowerCase())) {
                    return null; // Skip outfits that don't match the query
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
