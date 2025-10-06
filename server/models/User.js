import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, unique: true, required: true },
  email: { type: String, required: true, unique: true },
  firstName: { type: String },
  profilePic: { type: String },
  isAdmin: { type: Boolean, default: false },
});

export default mongoose.model("User", userSchema);
