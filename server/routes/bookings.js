import express from "express";
import {
  createBooking,
  getBookedSlots,
  getAllBookings,
  updateBooking,
} from "../controllers/bookingController.js";
import { authenticateUser, authorizeAdmin } from "../utils/authMiddleware.js";

const router = express.Router();

router.post("/", authenticateUser, createBooking);
router.get("/:date", getBookedSlots);

router.get("/admin/all", authenticateUser, authorizeAdmin, getAllBookings);
router.put("/admin/:id", authenticateUser, authorizeAdmin, updateBooking);

export default router;
