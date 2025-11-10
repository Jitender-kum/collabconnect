import express from "express";
import { registerInfluencer, registerBrand, loginUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/register-influencer", registerInfluencer);
router.post("/register-brand", registerBrand);
router.post("/login", loginUser);

import OTP from "../models/OTP.js";
import User from "../models/users.js";

router.post("/verify-otp", async (req, res) => {
  const { email, code } = req.body;

  const otp = await OTP.findOne({ email, code });
  if (!otp) return res.status(400).json({ message: "Invalid OTP" });

  await User.findOneAndUpdate({ email }, { verified: true });
  await OTP.deleteMany({ email });

  res.json({ message: "Account Verified ✅ You can now login." });
});


export default router;
