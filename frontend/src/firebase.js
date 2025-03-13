import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";


/**
 * Firebase configuration object containing API credentials.
 * @constant {Object}
 */
const firebaseConfig = {
  apiKey: "AIzaSyB7Tz8OWEwUuHAJGUFcyLyYPn_t_7y1csw",
  authDomain: "outfitly-dbd69.firebaseapp.com",
  projectId: "outfitly-dbd69",
  storageBucket: "outfitly-dbd69.firebasestorage.app",
  messagingSenderId: "725158613731",
  appId: "1:725158613731:web:d455d1e2c527c4a5f82bd6",
  measurementId: "G-B1MPW7HS4F"
};

/**
 * Initializes Firebase application with provided configuration.
 * @constant {FirebaseApp}
 */
const app = initializeApp(firebaseConfig);

/**
 * Firestore database instance.
 * @constant {Firestore}
 */
const db = getFirestore(app);

/**
 * Firebase authentication instance.
 * @constant {Auth}
 */
const auth = getAuth(app);

/**
 * Firebase storage instance.
 * @constant {Storage}
 */
const storage = getStorage(app);

export { db, auth, storage };
