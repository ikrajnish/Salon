import mongoose from "mongoose";

const membershipSchema = new mongoose.Schema({
  type: { type: String, enum: ["Normal", "Silver", "Gold"], default: "Normal" },
  startedAt: { type: Date },
  expiresAt: { type: Date },
  qrCodeToken: { type: String },
});

const userSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  firebaseUid: String,
  profilePic: { type: String, default: "" }, // <-- new field for Cloudinary URL
  membership: membershipSchema,
  isAdmin: { type: Boolean, default: false },
});

export default mongoose.model("User", userSchema);
