import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB7Tz8OWEwUuHAJGUFcyLyYPn_t_7y1csw",
  authDomain: "outfitly-dbd69.firebaseapp.com",
  projectId: "outfitly-dbd69",
  storageBucket: "outfitly-dbd69.firebasestorage.app",
  messagingSenderId: "725158613731",
  appId: "1:725158613731:web:d455d1e2c527c4a5f82bd6",
  measurementId: "G-B1MPW7HS4F"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };