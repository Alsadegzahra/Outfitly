const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const clothingRoutes = require("./routes/clothingRoutes");
const outfitRoutes = require("./routes/outfitRoutes"); // ✅ Import outfit routes
const searchRoutes = require("./routes/searchRoutes");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Ensure API routes are connected
app.use("/api/clothing", clothingRoutes);
app.use("/api/outfits", outfitRoutes);  // ✅ This MUST exist
app.use("/api/search", searchRoutes);  // ✅ This mounts the search API


const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
    .catch(err => console.error("MongoDB Connection Error:", err));
