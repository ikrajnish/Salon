import Booking from "../models/Booking.js";
import User from "../models/User.js";

// Admin: Create booking after salon visit
export const createBooking = async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ msg: "Admin only" });

    const { userId, userEmail, services, date, timeSlot, amount } = req.body;

    let user;
    if (userId) {
      user = await User.findById(userId);
    } else if (userEmail) {
      user = await User.findOne({ email: userEmail });
    }

    if (!user) return res.status(404).json({ msg: "User not found" });

    const booking = new Booking({
      user: user._id,
      services,
      date,
      timeSlot,
      amount,
      finalAmount: amount,
      status: "completed", // or "pending"
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

// Admin updates booking (status, amount, finalAmount)
export const updateBookingByAdmin = async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ msg: "Admin only" });

    const { status, amount, finalAmount } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ msg: "Booking not found" });

    if (status) booking.status = status;
    if (amount !== undefined) booking.amount = amount;
    if (finalAmount !== undefined) booking.finalAmount = finalAmount;

    await booking.save();
    res.json({ msg: "Booking updated", booking });
  } catch (err) {
    res.status(500).json({ msg: "Failed to update booking", error: err.message });
  }
};

