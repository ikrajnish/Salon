import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import bookingRoutes from "./routes/bookings.js";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js"; // 🆕 added
import userRoutes from "./routes/user.js";

dotenv.config();

const app = express();

// ✅ Middleware
app.use(
  cors({
    origin: ["http://localhost:5174","http://localhost:5173", "https://mores-dun.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);
app.use(express.json());

// ✅ Routes
app.use("/api/bookings", bookingRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes); // 🆕 added

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(5000, () => console.log("🚀 Server running on port 5000"));
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));
