import Campaign from "../models/Campaign.js";

// ✅ Create Campaign (Brand Only)
export const createCampaign = async (req, res) => {
  try {
    const { title, description, budget, niche } = req.body;

    const campaign = await Campaign.create({
      brandId: req.user._id,
      title,
      description,
      budget,
      niche
    });

    return res.json({ message: "✅ Campaign created successfully", campaign });
  } catch (err) {
    console.log("Create Campaign Error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ List Campaigns (For Influencers or Brand Dashboard)
export const listCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 }).populate("brandId", "brandName name");
    return res.json(campaigns);
  } catch (err) {
    console.log("List Campaigns Error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
