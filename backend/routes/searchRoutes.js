const express = require("express");
const router = express.Router();
const Clothing = require("../models/Clothing");
const Outfit = require("../models/Outfit");

// ✅ Search for both clothing items and outfits
router.get("/", async (req, res) => {
    try {
        let query = req.query.q || ""; // ✅ Ensure query is always a string
        query = String(query).trim(); // ✅ Convert to string and trim spaces

        console.log("🔍 Search Query:", query);

        const clothingItems = await Clothing.find({
            name: { $regex: query, $options: "i" } // ✅ Only use if query is valid
        });

        const outfits = await Outfit.find({
            name: { $regex: query, $options: "i" }
        }).populate("items");

        console.log("👕 Clothing Found:", clothingItems);
        console.log("🧥 Outfits Found:", outfits);

        res.json({ clothing: clothingItems, outfits: outfits });
    } catch (error) {
        console.error("❌ Error searching:", error);
        res.status(500).json({ error: "Error searching" });
    }
});

module.exports = router;
