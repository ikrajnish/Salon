import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors"; // optional but recommended for frontend connection

import bookingRoutes from "./routes/bookings.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

// ✅ Middlewares
app.use(cors()); // allow React frontend to connect
app.use(express.json()); // parse JSON bodies

// ✅ Routes
app.use("/api/bookings", bookingRoutes);
app.use("/api/auth", authRoutes);

// ✅ Connect to MongoDB & Start Server
mongoose
  .connect(process.env.MONGO_URI, {
    // You can omit these options in Mongoose v6+
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(5000, () => console.log("🚀 Server running on port 5000"));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });
