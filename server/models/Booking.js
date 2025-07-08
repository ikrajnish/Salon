import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  services: [String],
  date: String, // format: '2025-07-01'
  timeSlot: String, // format: '10:00 AM - 11:00 AM'
  status: { type: String, default: "pending" },
  amount: Number,
  finalAmount: Number,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Booking", bookingSchema);
