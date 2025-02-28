const admin = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");
const { getStorage } = require("firebase-admin/storage");

/**
 * @desc Initializes Firebase Admin SDK with Firestore and Storage.
 * Ensure `serviceAccountKey.json` is properly set up for authentication.
 *
 * @module FirebaseAdmin
 */

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    storageBucket: "outfitly-dbd69.firebasestorage.app"
});

/**
 * Firestore database instance.
 * @const {Firestore} db
 */
const db = getFirestore();

/**
 * Firebase Storage instance.
 * @const {Storage} storage
 */
const storage = getStorage();

module.exports = { db, storage };
