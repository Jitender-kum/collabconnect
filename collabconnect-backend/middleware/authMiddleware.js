import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Access Denied: No Token Provided" });
    }

    // Token verify karo
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // Seedha payload ko req.user mein daal do (isme { id: '...', role: '...' } hoga)
    req.user = verified;

    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid Token" });
  }
};