const express = require("express");
//const Clothing = require("../models/Clothing");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Set up storage for images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  }
});

const upload = multer({ storage: storage });

// Add clothing item with image upload
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, category, color } = req.body;

    if (!name || !category || !color) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!["Top", "Bottom", "Shoes", "Accessories", "Outerwear"].includes(category)) {
      return res.status(400).json({ error: "Invalid category" });
    }

    if (!["Red", "Blue", "Green", "Black", "White", "Gray", "Yellow", "Pink", "Purple", "Brown"].includes(color)) {
      return res.status(400).json({ error: "Invalid color" });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const newClothing = new Clothing({ name, category, color, image: imageUrl });
    await newClothing.save();
    res.status(201).json(newClothing);
  } catch (error) {
    res.status(500).json({ error: "Error adding clothing item" });
  }
});

// Get all clothing items
router.get("/", async (req, res) => {
  try {
    const clothes = await Clothing.find();
    res.json(clothes);
  } catch (error) {
    res.status(500).json({ error: "Error fetching clothing items" });
  }
});

// Serve uploaded images
router.use("/uploads", express.static("uploads"));

module.exports = router;
