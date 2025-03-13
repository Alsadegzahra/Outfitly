const express = require("express");
const cors = require("cors");
const functions = require("firebase-functions");
require("dotenv").config({ path: "./functions/.env" });

console.log("🚀 ENV LOADED: ", process.env.FIREBASE_API_KEY);

const clothingRoutes = require("./routes/clothingRoutes");
const outfitRoutes = require("./routes/outfitRoutes");
const searchRoutes = require("./routes/searchRoutes");

const app = express();
app.use(express.json());
app.use(cors());

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
 * Server listening port for local development.
 */
const PORT = process.env.PORT || 5000;

/**
 * Prevents Express from running twice in Firebase.
 * Ensures Firebase handles routing, not the local server.
 */
if (!process.env.FUNCTIONS_EMULATOR && !process.env.JEST_WORKER_ID) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}


/**
 * Error-handling middleware to catch unexpected errors.
 */
app.use((err, req, res, next) => {
  console.error("🔥 Unhandled Error:", err);
  res.status(500).send("Something went wrong!");
});

/**
 * Exporting API for Firebase Functions deployment.
 */
exports.api = functions.https.onRequest({ region: "us-central1" }, app);


module.exports = app;
