import express from "express";
import { authenticateUser } from "../utils/authMiddleware.js";
import { updateProfile } from "../controllers/userController.js";

const router = express.Router();

router.put("/profile", authenticateUser, updateProfile);

export default router;
