// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD_Iy-zy8L5Gs9eYuiYt--o3vVF9HWW_pM",
  authDomain: "shopverse-3f62a.firebaseapp.com",
  projectId: "shopverse-3f62a",
  storageBucket: "shopverse-3f62a.firebasestorage.app",
  messagingSenderId: "828790717307",
  appId: "1:828790717307:web:94acc318ccac4e7d9a5bde",
  measurementId: "G-MGXPQC72EP"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

// 🔵 Google Provider
export const googleProvider = new GoogleAuthProvider();

// 🔥 ADD THIS LINE (VERY IMPORTANT)
googleProvider.setCustomParameters({
  prompt: "select_account"
});