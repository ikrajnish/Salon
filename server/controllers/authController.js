import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  try {
    const { firstName, email, profilePic, referredBy } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    const referralCode = email.split("@")[0] + Math.floor(Math.random() * 1000);

    user = new User({
      firstName,
      email,
      profilePic,
      referralCode,
      referredBy: referredBy || null,
      discountBookingsRemaining: 3,
    });

    await user.save();

    // reward referrer
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
    res.status(500).json({ msg: "Signup failed", error: err.message });
  }
};
