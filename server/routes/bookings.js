import express from "express";
import { authenticateUser, authorizeAdmin } from "../utils/authMiddleware.js";
import { createBooking, getUserBookings, getAllBookings, updateBookingByAdmin } from "../controllers/bookingController.js";

const router = express.Router();

// Admin creates booking
router.post("/", authenticateUser, authorizeAdmin, createBooking);

// User fetches their bookings
router.get("/my", authenticateUser, getUserBookings);
// Admin updates booking
router.put("/admin/:id", authenticateUser, authorizeAdmin, updateBookingByAdmin);


// Admin fetches all bookings
router.get("/", authenticateUser, authorizeAdmin, getAllBookings);

export default router;
