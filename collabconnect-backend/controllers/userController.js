// controllers/userController.js
import User from "../models/users.js";

// 1. Get Logged-In User Details
export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (e) {
    console.error("Error in /me route:", e);
    res.status(500).json({ message: "Server error" });
  }
};

// 2. Get Public Profile by ID
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (e) {
    console.error("Error in /profile/:id route:", e);
    if (e.name === 'CastError') {
        return res.status(400).json({ message: "Invalid Profile ID" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// 3. ✅ NEW: Update Profile Logic
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    // ✅ Social Links bhi add kar diye
    const { name, brandName, website, niche, profilePhoto, socialLinks } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name,
        brandName,
        website,
        niche,
        profilePhoto,
        socialLinks // ✅ Ab ye bhi update hoga
      },
      { new: true }
    ).select("-password");

    res.json({ message: "Profile updated successfully ✅", user: updatedUser });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};