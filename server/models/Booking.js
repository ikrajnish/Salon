import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  services: [String],
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  status: { type: String, default: "pending" },
  amount: { type: Number, required: true },
  finalAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});


export default mongoose.model("Booking", bookingSchema);
