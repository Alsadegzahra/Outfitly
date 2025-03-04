const admin = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");
const { getStorage } = require("firebase-admin/storage");
require("dotenv").config();

let serviceAccount = require("./serviceAccountKey.json"); // ✅ Always load service credentials

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount), // ✅ No default login needed
    projectId: process.env.FIREBASE_PROJECT_ID || serviceAccount.project_id,
    storageBucket: "outfitly-dbd69.firebasestorage.app",
});

const db = getFirestore();
const storage = getStorage();

module.exports = { db, storage };
