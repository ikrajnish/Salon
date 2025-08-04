import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: String,
  phone: { type: String, required: true, unique: true },
  profilePic: String,
  referralCode: String,
  referredBy: String,
  isAdmin: { type: Boolean, default: false },
  discountBookingsRemaining: { type: Number, default: 3 },
});


export default mongoose.model("User", userSchema);
