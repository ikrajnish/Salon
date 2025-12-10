// routes/auth.js
import express from "express";
import { googleLogin } from "../controllers/authController.js";
import { requestOtp, verifyOtp } from "../controllers/otpController.js";

const router = express.Router();

// Google
router.post("/google", googleLogin);

// WhatsApp OTP
router.post("/request-otp", requestOtp);
router.post("/verify-otp", verifyOtp);

export default router;
