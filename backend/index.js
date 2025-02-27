const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

// ✅ Import all route files
const clothingRoutes = require("./routes/clothingRoutes");
const outfitRoutes = require("./routes/outfitRoutes");
const searchRoutes = require("./routes/searchRoutes");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Connect API routes
app.use("/api/clothing", clothingRoutes);
app.use("/api/outfits", outfitRoutes);
app.use("/api/search", searchRoutes);

const PORT = process.env.PORT || 5000;

// ✅ Improved MongoDB connection handling
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
    .catch(err => console.error("MongoDB Connection Error:", err));

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
