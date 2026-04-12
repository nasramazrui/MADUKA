import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyB91JYufqleX0FjUnnr5LjWtIXu5Th2qu8",
  authDomain: "supatz.firebaseapp.com",
  databaseURL: "https://supatz-default-rtdb.firebaseio.com",
  projectId: "supatz",
  storageBucket: "supatz.firebasestorage.app",
  messagingSenderId: "396176746766",
  appId: "1:396176746766:web:b16bf1be78078290018f5f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);

export default app;
