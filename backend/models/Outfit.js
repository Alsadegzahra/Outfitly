const mongoose = require('mongoose');

const OutfitSchema = new mongoose.Schema({
    name: { type: String, required: true },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Clothing' }],
    createdAt: { type: Date, default: Date.now } // ✅ Ensure createdAt is set
});

module.exports = mongoose.model('Outfit', OutfitSchema);
