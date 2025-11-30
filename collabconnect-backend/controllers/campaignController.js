import Campaign from "../models/Campaign.js";

// ✅ Create Campaign (Brand Only)
export const createCampaign = async (req, res) => {
  try {
    const { title, description, budget, requirements, startDate, endDate } = req.body;

    // FIX: 'req.user.id' use karo ('_id' nahi) kyunki middleware token se data le raha hai
    const brandId = req.user.id; 

    if (!brandId) {
      return res.status(401).json({ message: "Unauthorized: User ID missing" });
    }

    const campaign = await Campaign.create({
      brandId, // ✅ Sahi ID jayegi ab
      title,
      description,
      budget,
      requirements, // Ye fields bhi save honi chahiye
      startDate,
      endDate
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
    const campaigns = await Campaign.find()
      .sort({ createdAt: -1 })
      .populate("brandId", "brandName website"); // 'brandName' populate karna zaroori hai
      
    return res.json(campaigns);
  } catch (err) {
    console.log("List Campaigns Error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getBrandCampaigns = async (req, res) => {
  try {
    // Sirf wahi campaigns lao jinka brandId logged-in user ka hai
    const campaigns = await Campaign.find({ brandId: req.user.id })
      .sort({ createdAt: -1 }); // Latest pehle
      
    res.json(campaigns);
  } catch (err) {
    console.error("Get Brand Campaigns Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteCampaign = async (req, res) => {
  try {
    const campaignId = req.params.id;
    const brandId = req.user.id;

    // 1. Campaign dhoondo
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    // 2. Check karo ki ye isi Brand ka campaign hai ya nahi
    if (campaign.brandId.toString() !== brandId) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    // 3. Delete karo
    await Campaign.findByIdAndDelete(campaignId);

    // Optional: Is campaign se judi applications bhi delete kar sakte ho
    // await Application.deleteMany({ campaignId: campaignId });

    res.json({ message: "Campaign deleted successfully" });
  } catch (err) {
    console.error("Delete Campaign Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};