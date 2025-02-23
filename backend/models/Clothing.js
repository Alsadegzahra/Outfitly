const mongoose = require("mongoose");

const allowedCategories = ["Top", "Bottom", "Shoes", "Accessories", "Outerwear"];
const allowedColors = ["Red", "Blue", "Green", "Black", "White", "Gray", "Yellow", "Pink", "Purple", "Brown"];

const ClothingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true, enum: allowedCategories },
  color: { type: String, required: true, enum: allowedColors },
  image: { type: String, required: false }, // Stores image URL
  lastWorn: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Clothing", ClothingSchema);
