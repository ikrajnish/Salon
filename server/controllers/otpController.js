// controllers/otpController.js
import Otp from "../models/Otp.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { sendTemplate, sendText } from "../utils/whatsappService.js";

/**
 * POST /api/auth/request-otp
 * body: { phone }
 */
export const requestOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ msg: "phone is required" });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete old OTPs for same phone (avoid duplicates)
    await Otp.deleteMany({ phone });

    // Save new OTP
    await Otp.create({ phone, otp });

    // Send via WhatsApp Template
    try {
      await sendTemplate(
        phone,
        process.env.WA_OTP_TEMPLATE_NAME || "salon_otp_template",
        "en_US",
        [
          {
            type: "body",
            parameters: [{ type: "text", text: otp }],
          },
        ]
      );
    } catch (err) {
      console.error("Template failed, trying text send:", err);
      await sendText(phone, `Your OTP is ${otp}. Valid for 5 minutes.`);
    }

    return res.json({ msg: "OTP sent successfully" });
  } catch (err) {
    console.error("requestOtp error:", err);
    return res.status(500).json({ msg: "Failed to send OTP", error: err.message });
  }
};

/**
 * POST /api/auth/verify-otp
 * body: { phone, otp }
 */
export const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) return res.status(400).json({ msg: "phone and otp required" });

    // Look for OTP in DB
    const record = await Otp.findOne({ phone, otp });
    if (!record) {
      return res.status(401).json({ msg: "Invalid or expired OTP" });
    }

    // OTP verified → delete it
    await Otp.deleteMany({ phone });

    // Find or create user
    let user = await User.findOne({ phone });
    if (!user) {
      user = new User({
        phone,
        name: "",
        membership: { type: "Normal" },
      });
      await user.save();
    }

    // Issue JWT
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ token, user });
  } catch (err) {
    console.error("verifyOtp error:", err);
    return res.status(500).json({ msg: "OTP verification failed", error: err.message });
  }
};
