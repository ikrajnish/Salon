import jwt from "jsonwebtoken";

export const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ msg: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ msg: "Invalid token" });
  }
};

export const authorizeAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ msg: "Admin only" });
  }
  next();
};
