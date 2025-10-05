import Booking from "../models/Booking.js";
import User from "../models/User.js";

// Admin: Create booking after salon visit
export const createBooking = async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ msg: "Admin only" });

    const { userId, services, date, timeSlot, amount } = req.body;

    const booking = new Booking({
      user: userId,
      services,
      date,
      timeSlot,
      amount,
      finalAmount: amount,
      status: "completed",
    });

    await booking.save();
    res.status(201).json({ msg: "Booking created", booking });
  } catch (err) {
    res.status(500).json({ msg: "Failed to create booking", error: err.message });
  }
};

// User: Get own bookings
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch bookings", error: err.message });
  }
};

// Admin: Get all bookings
export const getAllBookings = async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ msg: "Admin only" });
    const bookings = await Booking.find().populate("user", "firstName email");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch bookings", error: err.message });
  }
};
