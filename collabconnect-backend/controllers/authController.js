import User from "../models/users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendMail } from "../utils/sendMail.js"; // ✅ Tumhari mail file import ki
import OTP from "../models/OTP.js"; // ✅ Tumhara OTP model import kiya

// (Ensure kar lena ki '../utils/sendMail.js' path sahi hai)

export const registerInfluencer = async (req, res) => {
  try {
    const { name, email, password, niche, links } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      niche,
      role: "Influencer",
      socialLinks: links,
      verified: false // ✅ User verified nahi hai
    });

    // --- OTP LOGIC START ---
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.create({ email: user.email, code: code });

    try {
      await sendMail(
        user.email,
        "CollabConnect - Verify Your Account",
        `Your 6-digit OTP code is: ${code}`
      );
      console.log(`OTP sent to ${email}`);
    } catch (mailError) {
       console.error("Mail sending failed:", mailError);
       // User ban gaya hai, par email nahi gaya. Frontend ko bata do.
       return res.status(500).json({ message: "User registered, but failed to send OTP email." });
    }
    // --- OTP LOGIC END ---

    res.json({ message: "Influencer registered. Please check email for OTP." });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const registerBrand = async (req, res) => {
  try {
    const { brandName, email, password, website } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      brandName,
      email,
      website,
      password: hashed,
      role: "Brand",
      verified: false // ✅ User verified nahi hai
    });

    // --- OTP LOGIC START ---
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.create({ email: user.email, code: code });

    try {
      await sendMail(
        user.email,
        "CollabConnect - Verify Your Account",
        `Your 6-digit OTP code is: ${code}`
      );
      console.log(`OTP sent to ${email}`);
    } catch (mailError) {
       console.error("Mail sending failed:", mailError);
       return res.status(500).json({ message: "User registered, but failed to send OTP email." });
    }
    // --- OTP LOGIC END ---

    res.json({ message: "Brand registered. Please check email for OTP." });
  } catch (err) {
    console.error("Brand Register Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid Credentials" });

    // ✅ VERIFIED CHECK
    if (!user.verified) {
        return res.status(401).json({ 
            message: "Account not verified. Please check your email for OTP.",
            notVerified: true,
            email: user.email
        });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid Credentials" });

    // Token generation
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      message: "Login Success ✅",
      token,
      user: {
        _id: user._id,
        name: user.name || user.brandName,
        email: user.email,
        role: user.role,
      }
    });
  } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({ message: "Server Error during login" });
  }
};