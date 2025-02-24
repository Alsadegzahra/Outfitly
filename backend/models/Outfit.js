// Outfit.js (Mongoose Model) - Ensure createdAt field is included
const mongoose = require('mongoose');

const OutfitSchema = new mongoose.Schema({
    name: { type: String, required: true },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Clothing' }],
    createdAt: { type: Date, default: Date.now } // ✅ Ensure createdAt is set
});

module.exports = mongoose.model('Outfit', OutfitSchema);


// Update the outfit creation route (index.js or a route file)
const express = require('express');
const router = express.Router();
const Outfit = require('./Outfit');

// Create new outfit with a timestamp
router.post('/api/outfits', async (req, res) => {
    try {
        const { name, items } = req.body;
        const newOutfit = new Outfit({
            name,
            items,
            createdAt: new Date() // ✅ Ensure createdAt is set on creation
        });
        await newOutfit.save();
        res.status(201).json(newOutfit);
    } catch (error) {
        res.status(500).json({ error: 'Error creating outfit' });
    }
});

module.exports = router;
