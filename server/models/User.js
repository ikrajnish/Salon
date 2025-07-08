import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: String,
  email: { type: String, unique: true },
  profilePic: String,
  isAdmin: { type: Boolean, default: false },
  referralCode: String,
  referredBy: String,
  discountBookingsRemaining: { type: Number, default: 3 },
});


export default mongoose.model("User", userSchema);
