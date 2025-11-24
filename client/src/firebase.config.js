// Import the functions you need from the SDKs you need
// src/firebase.config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCgEqeMB8pPwaJ4beCoXt459PAIi7YW4J8",
  authDomain: "mores-b0140.firebaseapp.com",
  projectId: "mores-b0140",
  storageBucket: "mores-b0140.firebasestorage.app",
  messagingSenderId: "201392825948",
  appId: "1:201392825948:web:81190d2cbfc608d950e899"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };



  