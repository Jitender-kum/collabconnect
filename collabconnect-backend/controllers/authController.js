import User from "../models/users.js"; // ✅ Fixed: 'User.js' se 'users.js' kar diya
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
      socialLinks: links
    });

    res.json({ message: "Influencer registered" });
  } catch (err) {
    console.error("Register Error:", err); // Added error logging for better debugging
    res.status(500).json({ message: "Server Error" });
  }
};

export const registerBrand = async (req, res) => {
  try {
    const { brandName, email, password, website } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    await User.create({
      brandName,
      email,
      website,
      password: hashed,
      role: "Brand"
    });

    res.json({ message: "Brand registered" });
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
        // Add other necessary fields here, but avoid sending password
      }
    });
  } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({ message: "Server Error during login" });
  }
};