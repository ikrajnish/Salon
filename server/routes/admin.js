// routes/admin.js
import express from "express";
import User from "../models/User.js";
import { authenticateUser, authorizeAdmin } from "../utils/authMiddleware.js";
import { setMembership, verifyMembershipQR, resetExpiredMemberships } from "../controllers/membershipController.js";

const router = express.Router();

router.get("/users", authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const users = await User.find().select("firstName email membership");
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch users", error: err.message });
  }
});
router.put("/membership/:userId", authenticateUser, authorizeAdmin, setMembership);
router.get("/membership/verify/:token", verifyMembershipQR);
router.post("/membership/reset-expired", authenticateUser, authorizeAdmin, resetExpiredMemberships);

export default router;
