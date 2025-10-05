import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, unique: true }, // Firebase UID
  email: { type: String, required: true, unique: true },
  firstName: String,
  profilePic: String,
  isAdmin: { type: Boolean, default: false },
});

export default mongoose.model("User", userSchema);
