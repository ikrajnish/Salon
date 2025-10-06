// controllers/authController.js
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import admin from "../config/firebaseAdmin.js";

// Initialize Firebase Admin with service account if provided, otherwise ADC
/**
 * POST /api/auth/google
 * Accepts either:
 *  - body: { idToken: "<firebase id token>" }
 *  - Authorization header: "Bearer <firebase id token>"
 *
 * Verifies Firebase ID token, creates/gets user, returns backend JWT + user.
 */
export const googleLogin = async (req, res) => {
  try {
    // Accept idToken from body or Authorization header
    let idToken = null;
    if (req.body && req.body.idToken) idToken = req.body.idToken;
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!idToken && authHeader) {
      idToken = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;
    }

    if (!idToken) return res.status(400).json({ msg: "ID Token required (body or Authorization header)" });

    // Verify Firebase ID token
    const decoded = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name, picture } = decoded;

    let user = await User.findOne({ firebaseUid: uid });
if (!user) {
  user = new User({
    firebaseUid: uid,
    email,
    firstName: name || "",
    profilePic: picture || "",
  });
  await user.save();
} else {
      // Ensure firebaseUid is set if missing
      if (!user.firebaseUid) {
        user.firebaseUid = uid;
        await user.save();
      }
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({ token, user });
  } catch (err) {
    console.error("Google login error:", err);
    // Distinguish verification errors if possible
    if (err.code === "auth/id-token-expired" || err.code === "auth/invalid-id-token") {
      return res.status(401).json({ msg: "Invalid or expired Firebase ID token", error: err.message });
    }
    return res.status(500).json({ msg: "Login failed", error: err.message || err.toString() });
  }
};
