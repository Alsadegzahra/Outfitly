const express = require("express");
const router = express.Router();
const multer = require("multer");
const Clothing = require("../models/Clothing");

// Set up multer storage for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // Save files in the "uploads" folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage: storage });

// ✅ Route to add clothing item (Supports both JSON & Image Upload)
router.post("/add", async (req, res) => {
    try {
        if (req.headers["content-type"]?.startsWith("multipart/form-data")) {
            upload.single("image")(req, res, async function (err) {
                if (err) {
                    return res.status(400).json({ error: "File upload error" });
                }
                await handleClothingCreation(req, res);
            });
        } else {
            upload.none()(req, res, async function (err) {
                if (err) {
                    return res.status(400).json({ error: "Invalid request" });
                }
                await handleClothingCreation(req, res);
            });
        }
    } catch (error) {
        console.error("Error adding clothing:", error);
        res.status(500).json({ error: "Error adding clothing item" });
    }
});

// ✅ Function to process clothing creation logic
async function handleClothingCreation(req, res) {
    try {
        console.log("Request Body:", req.body);
        console.log("Uploaded File:", req.file);

        const { name, category, color } = req.body;

        if (!name || !category || !color) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const allowedCategories = ["Top", "Bottom", "Shoes", "Accessories", "Outerwear"];
        if (!allowedCategories.includes(category)) {
            return res.status(400).json({ error: "Invalid category" });
        }

        const allowedColors = ["Red", "Blue", "Green", "Black", "White", "Gray", "Yellow", "Pink", "Purple", "Brown"];
        if (!allowedColors.includes(color)) {
            return res.status(400).json({ error: "Invalid color" });
        }

        // Handle optional image: Use uploaded file OR provided image URL
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.image || null;

        const newClothing = new Clothing({ name, category, color, image: imageUrl });
        await newClothing.save();

        res.status(201).json(newClothing);
    } catch (error) {
        console.error("Error saving clothing:", error);
        res.status(500).json({ error: "Error adding clothing item" });
    }
}

// ✅ Route to get all clothing items
router.get("/", async (req, res) => {
    try {
        const clothes = await Clothing.find();
        res.json(clothes);
    } catch (error) {
        console.error("Error fetching clothing items:", error);
        res.status(500).json({ error: "Error fetching clothing items" });
    }
});

module.exports = router;
