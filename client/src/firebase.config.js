// Import the functions you need from the SDKs you need
// src/firebase.config.js
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBOnt_j6-g28-8U_mfIH2mn-C2kRkalXb0",
  authDomain: "salon-64bd1.firebaseapp.com",
  projectId: "salon-64bd1",
  storageBucket: "salon-64bd1.firebasestorage.app",
  messagingSenderId: "509611331906",
  appId: "1:509611331906:web:da39b2b5b47b6c505478db",
  measurementId: "G-N3V85L22NX"
};

const app = initializeApp(firebaseConfig);

// ✅ Export the app
export { app };

  