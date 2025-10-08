// controllers/membershipController.js
import crypto from "crypto";
import User from "../models/User.js";

export const setMembership = async (req, res) => {
  try {
    const { type, durationInMonths } = req.body;
    const { userId } = req.params;

    if (!["Silver", "SilverPlus", "Gold"].includes(type))
      return res.status(400).json({ msg: "Invalid membership type" });
    if (![3, 6, 12].includes(durationInMonths))
      return res.status(400).json({ msg: "Invalid duration" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const now = new Date();
    const expiresAt = new Date();
    expiresAt.setMonth(now.getMonth() + durationInMonths);

    const qrCodeToken = crypto.randomBytes(16).toString("hex");

    user.membership = { type, startedAt: now, expiresAt, qrCodeToken };
    await user.save();

    res.json({
      msg: `${user.firstName} upgraded to ${type} for ${durationInMonths} months`,
      membership: user.membership,
    });
  } catch (err) {
    res.status(500).json({ msg: "Failed to set membership", error: err.message });
  }
};

export const verifyMembershipQR = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ "membership.qrCodeToken": token });

    if (!user) return res.status(404).json({ valid: false, message: "Invalid QR" });
    if (new Date() > user.membership.expiresAt)
      return res.json({ valid: false, message: "Membership expired" });

    res.json({
      valid: true,
      user: {
        name: user.firstName,
        email: user.email,
        type: user.membership.type,
        expiresAt: user.membership.expiresAt,
      },
    });
  } catch (err) {
    res.status(500).json({ valid: false, error: err.message });
  }
};

export const resetExpiredMemberships = async (req, res) => {
  try {
    const expiredUsers = await User.find({
      "membership.expiresAt": { $lte: new Date() },
      "membership.type": { $ne: "Normal" },
    });

    for (const user of expiredUsers) {
      user.membership = { type: "Normal" };
      await user.save();
    }

    res.json({ msg: `Reset ${expiredUsers.length} expired memberships` });
  } catch (err) {
    res.status(500).json({ msg: "Failed to reset expired memberships", error: err.message });
  }
};
