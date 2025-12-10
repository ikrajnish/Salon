// models/Otp.js
import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  phone: { type: String, required: true, index: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 } 
  // TTL index: automatically deletes OTP documents after 5 minutes (300 sec)
});

export default mongoose.model("Otp", otpSchema);
