import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/users.js";
import OTP from "../models/OTP.js";
import { sendMail } from "../utils/sendMail.js";

// helper: handle → full URL
const toUrl = (val, base) => {
  if (!val) return "";
  const v = val.trim();
  if (v.startsWith("http://") || v.startsWith("https://")) return v;
  if (v.startsWith("@")) return base + v.slice(1);
  return base + v;
};

export const registerInfluencer = async (req, res) => {
  console.log("REQ BODY =>", req.body);

  try {
    const { name, email, password, niche, links } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    if (!Array.isArray(links) || links.length === 0) {
      return res.status(400).json({ message: "At least one social account is required." });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ✅ Sanitize followers count
    const cleanedLinks = links.map(l => ({
      platform: l.platform.trim(),
      url: l.url.trim(),
      followers: Number(l.followers || 0)
    }));

    // ✅ Calculate reach score from followers
    const reachScore = cleanedLinks.reduce((sum, l) => sum + l.followers, 0);

    const hashed = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashed,
      role: "Influencer",
      niche,
      socialLinks: cleanedLinks,
      reachScore,
    });

    // ✅ Generate OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.create({ email, code });

    // ✅ Send Email
    await sendMail(email, "Verify your CollabConnect Account", `Your OTP is: ${code}`);

    return res.json({ message: "Registration successful. Check your email for OTP.", email });

  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Server Error", error: e.message });
  }
};


export const registerBrand = async (req, res) => {
  try {
    const { brandName, email, password, website } = req.body;
    if (!brandName || !email || !password) return res.status(400).json({ message: "Missing fields" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Brand already exists" });

    const hashed = await bcrypt.hash(password, 10);
    await User.create({ brandName, email, password: hashed, role: "Brand", website });
    
     const code = Math.floor(100000 + Math.random() * 900000).toString();

    await OTP.create({ email, code });

    // ✅ Send OTP Email
    await sendMail(email, "Your CollabConnect Verification OTP", `Your OTP is: ${code}`);

    return res.json({ message: "Registration successful ✅. Check your email for OTP.", email });
    
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
};



export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Wrong Password" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    const { password: _, ...safe } = user.toObject();
    res.json({ message: "Login Successful ✅", token, user: safe });
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
};
