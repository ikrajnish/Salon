import Booking from "../models/Booking.js";
import User from "../models/User.js";

// Create booking
export const createBooking = async (req, res) => {
  try {
    const { services, date, timeSlot } = req.body;
    const userId = req.user.id;

    // Check if slot is already booked
    const existing = await Booking.findOne({ date, timeSlot });
    if (existing) return res.status(400).json({ msg: "Time slot already booked" });

    const user = await User.findById(userId);

    let amount = null;
    let finalAmount = null;
    const discountEligible = user.discountBookingsRemaining > 0;

    const booking = new Booking({
      user: userId,
      services,
      date,
      timeSlot,
      amount,
      finalAmount,
    });

    if (discountEligible) {
      user.discountBookingsRemaining -= 1;
      await user.save();
    }

    await booking.save();
    res.status(201).json({ msg: "Booking successful", booking });
  } catch (err) {
    res.status(500).json({ msg: "Booking failed", error: err.message });
  }
};

// Get booked slots for a specific date
export const getBookedSlots = async (req, res) => {
  try {
    const { date } = req.params;
    const bookings = await Booking.find({ date });
    const slots = bookings.map((b) => b.timeSlot);
    res.json(slots);
  } catch (err) {
    res.status(500).json({ msg: "Failed to get slots", error: err.message });
  }
};

// Admin: Get all bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("user", "firstName email");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch bookings", error: err.message });
  }
};

// Admin: Update booking status & billing
export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, amount } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ msg: "Booking not found" });

    booking.status = status;
    booking.amount = amount;
    booking.finalAmount = amount;

    // Apply discount if user is eligible (already handled on creation, optional here)

    await booking.save();
    res.json({ msg: "Booking updated", booking });
  } catch (err) {
    res.status(500).json({ msg: "Update failed", error: err.message });
  }
};
