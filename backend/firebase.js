const admin = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");
const { getStorage } = require("firebase-admin/storage");

// ✅ Load Firebase Admin SDK (ensure `serviceAccountKey.json` is set up)
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    storageBucket: "outfitly-dbd69.firebasestorage.app" // Example: outfitly-1234.appspot.com
});

const db = getFirestore();
const storage = getStorage();

module.exports = { db, storage };
