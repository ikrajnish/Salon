import User from "../models/User.js";

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // extracted by JWT middleware
    const { firstName, profilePic } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (firstName !== undefined) user.name = firstName;
    if (profilePic !== undefined) user.profilePic = profilePic;

    await user.save();

    return res.json({ msg: "Profile updated", user });
  } catch (err) {
    res.status(500).json({ msg: "Failed to update profile", error: err.message });
  }
};
