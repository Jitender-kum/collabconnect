import Campaign from "../models/Campaign.js";
import User from "../models/users.js";

export const createCampaign = async (req, res) => {
  try {
    const { title, description, budget } = req.body;
    const brand = await User.findById(req.user.id);
    if (!brand || brand.role !== "Brand") return res.status(403).json({ message: "Only Brand can create campaigns ❌" });

    const campaign = await Campaign.create({ brandId: brand._id, title, description, budget });
    res.json({ message: "Campaign Created ✅", campaign });
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
};

export const getAllCampaigns = async (_req, res) => {
  const campaigns = await Campaign.find().sort({ createdAt: -1 });
  res.json(campaigns);
};
