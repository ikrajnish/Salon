// controllers/authController.js
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  try {
    const { phone, firstName, profilePic, referredBy } = req.body;

    if (!phone) return res.status(400).json({ msg: "Phone number is required" });

    let user = await User.findOne({ phone });

    // If user exists, just return token
    if (user) {
      const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.status(200).json({ token, user });
    }

    const referralCode = phone.slice(-4) + Math.floor(Math.random() * 1000);

    user = new User({
      phone,
      firstName,
      profilePic,
      referralCode,
      referredBy: referredBy || null,
      discountBookingsRemaining: 3,
    });

    await user.save();

    // Reward the referrer if exists
    if (referredBy) {
      const referrer = await User.findOne({ referralCode: referredBy });
      if (referrer) {
        referrer.discountBookingsRemaining = 3;
        await referrer.save();
      }
    }

    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({ token, user });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ msg: "Signup failed", error: err.message });
  }
};
