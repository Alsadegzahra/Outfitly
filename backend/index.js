const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { db, storage } = require("./firebase"); // ✅ Import from backend/firebase.js

const clothingRoutes = require("./routes/clothingRoutes");
const outfitRoutes = require("./routes/outfitRoutes");
const searchRoutes = require("./routes/searchRoutes");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ API Routes
app.use("/api/clothing", clothingRoutes);
app.use("/api/outfits", outfitRoutes);
app.use("/api/search", searchRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
