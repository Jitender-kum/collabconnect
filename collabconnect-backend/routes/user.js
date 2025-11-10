import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import User from "../models/users.js"; // <-- correct path & casing

const router = express.Router();

router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
});


router.get("/profile/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("name niche socialLinks followerCounts reachScore profilePhoto");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});



export default router;
