// routes/user.js
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
// Hum controller se functions import kar rahe hain
import { getMyProfile, getUserProfile, updateProfile } from "../controllers/userController.js";

const router = express.Router();

// Get own profile
router.get("/me", authMiddleware, getMyProfile);

// ✅ NEW: Update profile route
router.put("/update", authMiddleware, updateProfile);

// Get public profile
router.get("/profile/:id", getUserProfile);

export default router;