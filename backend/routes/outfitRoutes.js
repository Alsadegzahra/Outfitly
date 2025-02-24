const express = require("express");
const router = express.Router();
const Outfit = require("../models/Outfit");

// ✅ Create a new outfit
router.post("/outfits", async (req, res) => {
    try {
        const { name, items } = req.body;
        const newOutfit = new Outfit({
            name,
            items,
            createdAt: new Date(), // ✅ Ensure createdAt is set
        });
        await newOutfit.save();
        res.status(201).json(newOutfit);
    } catch (error) {
        res.status(500).json({ error: "Error creating outfit" });
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

// ✅ Delete an outfit
router.delete("/outfits/:id", async (req, res) => {
    try {
        await Outfit.findByIdAndDelete(req.params.id);
        res.json({ message: "Outfit deleted" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting outfit" });
    }
});

module.exports = router;
