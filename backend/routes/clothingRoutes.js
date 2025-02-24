const express = require("express");
const router = express.Router();
const Clothing = require("../models/Clothing");
const Outfit = require("../models/Outfit");

// ✅ Add new item to closet
router.post("/items", async (req, res) => {
    try {
        const { name, category, color, image } = req.body;
        const newItem = new Clothing({ name, category, color, image });
        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ error: "Error adding item" });
    }
});

// ✅ Get all items in closet
router.get("/", async (req, res) => {
    try {
        const items = await Clothing.find();
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: "Error fetching items" });
    }
});

// ✅ Delete item + Cascade Delete (Remove related outfits)
router.delete("/items/:id", async (req, res) => {
    try {
        const itemId = req.params.id;
        await Clothing.findByIdAndDelete(itemId);
        await Outfit.deleteMany({ items: itemId });
        res.json({ message: "Item and associated outfits deleted" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting item" });
    }
});

module.exports = router;
