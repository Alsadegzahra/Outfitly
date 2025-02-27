const express = require("express");
const router = express.Router();
const Outfit = require("../models/Outfit");

// ✅ Create a new outfit
router.post("/", async (req, res) => {
    try {
        console.log("📩 Received Outfit Data:", req.body);  // ✅ Log the incoming request
        
        const { name, items } = req.body;

        // ✅ Validate required fields
        if (!name || !items || !Array.isArray(items)) {
            console.log("❌ Missing required fields:", { name, items });
            return res.status(400).json({ error: "Missing required fields" });
        }

        const newOutfit = new Outfit({ name, items });
        await newOutfit.save();
        console.log("✅ Outfit saved successfully:", newOutfit);

        res.status(201).json(newOutfit);
    } catch (error) {
        console.error("❌ Error saving outfit:", error);
        res.status(500).json({ error: "Error saving outfit" });
    }
});



router.get("/", async (req, res) => {
    try {
        const outfits = await Outfit.find().populate("items");
        res.json(outfits || []);  // ✅ Ensure it returns an array, not null
    } catch (error) {
        console.error("❌ Error fetching outfits:", error);
        res.status(500).json({ error: "Error fetching outfits" });
    }
});


router.delete("/:id", async (req, res) => {
    try {
        const deletedOutfit = await Outfit.findByIdAndDelete(req.params.id);
        if (!deletedOutfit) {
            return res.status(404).json({ error: "Outfit not found" });
        }

        res.json({ message: "Outfit deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting outfit:", error);
        res.status(500).json({ error: "Error deleting outfit" });
    }
});



module.exports = router;
