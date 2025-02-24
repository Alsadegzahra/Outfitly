const express = require("express");
const router = express.Router();
const Clothing = require("../models/Clothing");
const Outfit = require("../models/Outfit");

// ✅ Search for items and outfits by name, excluding deleted ones
router.get("/search", async (req, res) => {
    try {
        const query = req.query.q;

        // ✅ Only return items that still exist in the database
        const items = await Clothing.find({ 
            name: { $regex: query, $options: "i" } 
        });

        const outfits = await Outfit.find({ 
            name: { $regex: query, $options: "i" } 
        });

        res.json({ items, outfits });
    } catch (error) {
        res.status(500).json({ error: "Error searching" });
    }
});

module.exports = router;
