const admin = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");
const { getStorage } = require("firebase-admin/storage");
require("dotenv").config();

let serviceAccount = require("./serviceAccountKey.json"); // ✅ Load service credentials

// ✅ Initialize Firebase only if it's not already initialized
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID || serviceAccount.project_id,
        storageBucket: `${serviceAccount.project_id}.appspot.com`, // ✅ Fix storageBucket
    });
}

const db = getFirestore();
const storage = getStorage();

module.exports = { db, storage };
