// utils/authMiddleware.js
import jwt from "jsonwebtoken";

export const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader) return res.status(401).json({ msg: "Unauthorized: no token provided" });

  // support "Bearer <token>" or raw token
  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded should contain { id, isAdmin }
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return res.status(403).json({ msg: "Invalid or expired token" });
  }
};

export const authorizeAdmin = (req, res, next) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ msg: "Admin only" });
  }
  next();
};
