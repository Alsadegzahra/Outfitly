const express = require("express");
const cors = require("cors");
require("dotenv").config();

const clothingRoutes = require("./routes/clothingRoutes");
const outfitRoutes = require("./routes/outfitRoutes");
const searchRoutes = require("./routes/searchRoutes");

const app = express();
app.use(express.json());
app.use(cors());

/**
 * Express application instance.
 * @constant {Express}
 */

/**
 * @route /api/clothing
 * @desc Routes related to clothing management.
 */
app.use("/api/clothing", clothingRoutes);

/**
 * @route /api/outfits
 * @desc Routes related to outfit management.
 */
app.use("/api/outfits", outfitRoutes);

/**
 * @route /api/search
 * @desc Routes related to searching clothing and outfits.
 */
app.use("/api/search", searchRoutes);

/**
 * Server listening port.
 * @constant {number}
 */
const PORT = process.env.PORT || 5000;

/**
 * Starts the Express server **only if not in test mode**.
 */
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

module.exports = app; 
