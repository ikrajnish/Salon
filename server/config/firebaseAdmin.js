// config/firebaseAdmin.js
import admin from "firebase-admin";
import fs from "fs";
import path from "path";

if (!admin.apps.length) {
  try {
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      // ✅ Use env variables (Vercel / production)
      const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n");
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey,
        }),
      });
      console.log("✅ Firebase Admin initialized via environment variables");
    } else {
      // ✅ Use local service account JSON (development)
      const serviceAccountPath = path.resolve("./serviceAccountKey.json");
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log("✅ Firebase Admin initialized via local JSON");
    }
  } catch (err) {
    console.error("❌ Firebase Admin initialization error:", err);
  }
}

export default admin;
