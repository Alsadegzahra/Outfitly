const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const clothingRoutes = require("./routes/clothingRoutes"); // ✅ Import routes

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/clothing", clothingRoutes); // ✅ Ensure this matches your Postman request

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
    .catch(err => console.error(err));
