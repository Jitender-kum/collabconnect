import express from "express";
import { registerInfluencer, registerBrand, login } from "../controllers/authController.js";
import OTP from "../models/OTP.js";
import User from "../models/users.js"; // Wapas 'users.js' kar diya hai

const router = express.Router();

// Auth Routes
router.post("/register-influencer", registerInfluencer);
router.post("/register-brand", registerBrand);
router.post("/login", login);

// OTP Verification Route
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, code } = req.body;

    const otp = await OTP.findOne({ email, code });
    if (!otp) return res.status(400).json({ message: "Invalid OTP" });

    await User.findOneAndUpdate({ email }, { verified: true });
    await OTP.deleteMany({ email });

    res.json({ message: "Account Verified ✅ You can now login." });
  } catch (error) {
    res.status(500).json({ message: "Server Error during verification" });
  }
});

export default router;