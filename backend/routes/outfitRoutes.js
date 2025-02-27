const express = require("express");
const router = express.Router();
const Outfit = require("../models/Outfit");

// ✅ Create a new outfit
router.post("/items", async (req, res) => {
    try {
        console.log("📩 Received:", req.body);  // Log incoming request
        const { name, category, color, image } = req.body;

        // Validate input
        if (!name || !category || !color) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const newItem = new Clothing({ name, category, color, image });
        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        console.error("❌ Error adding item:", error);
        res.status(500).json({ error: "Error adding item" });
    }
});


// ✅ Get all outfits
router.get("/outfits", async (req, res) => {
    try {
        const outfits = await Outfit.find().populate("items");
        res.json(outfits);
    } catch (error) {
        res.status(500).json({ error: "Error fetching outfits" });
    }
});

module.exports = router;
