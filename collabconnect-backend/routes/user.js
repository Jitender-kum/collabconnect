import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import User from "../models/users.js";

const router = express.Router();

router.get("/me", authMiddleware, async (req, res) => {
  try {
    // Ab 'req.user.id' pakka string hai
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (e) {
    console.error("Error in /me route:", e);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/profile/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (e) {
    console.error("Error in /profile/:id route:", e);
    // Agar ID galat format ki hai (e.g., "undefined"), to CastError aayega
    if (e.name === 'CastError') {
        return res.status(400).json({ message: "Invalid Profile ID" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

export default router;