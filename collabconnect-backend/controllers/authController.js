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
  try {
    const { name, email, password, niche, instagram, youtube, twitter, facebook } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "Missing fields" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    // build normalized links
    const links = {
      instagram: instagram ? toUrl(instagram, "https://instagram.com/") : "",
      youtube:   youtube   ? (youtube.includes("channel/") || youtube.includes("watch?") || youtube.includes("@")
                      ? (youtube.startsWith("http") ? youtube : `https://youtube.com/${youtube}`)
                      : `https://youtube.com/@${youtube.replace(/^@/,"")}`) : "",
      twitter:   twitter   ? toUrl(twitter, "https://x.com/") : "",
      facebook:  facebook  ? toUrl(facebook, "https://facebook.com/") : "",
    };


    // ensure at least one link
    if (![links.instagram, links.youtube, links.twitter, links.facebook].some(Boolean)) {
      return res.status(400).json({ message: "Add at least one social link (Instagram / YouTube / X / Facebook)" });
    }

        // NEW: follower counts (int & >=0)
    const toInt = (v) => Math.max(0, parseInt(v || 0, 10) || 0);
    const followerCounts = {
      instagram: toInt(igFollowers),
      youtube:   toInt(ytSubscribers),
      twitter:   toInt(twFollowers),
      facebook:  toInt(fbFollowers),
    };

    // simple reach score (tune later)
    const reachScore =
      followerCounts.instagram * 1.0 +
      followerCounts.youtube   * 1.2 +
      followerCounts.twitter   * 0.8 +
      followerCounts.facebook  * 0.6;

    const hashed = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashed,
      role: "Influencer",
      niche,
      socialLinks: links,
      followerCounts,
      reachScore
    });

     const code = Math.floor(100000 + Math.random() * 900000).toString();

    await OTP.create({ email, code });

    // ✅ Send OTP Email
    await sendMail(email, "Your CollabConnect Verification OTP", `Your OTP is: ${code}`);

    return res.json({ message: "Registration successful. Check your email for OTP.", email });
  
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e.message });
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
