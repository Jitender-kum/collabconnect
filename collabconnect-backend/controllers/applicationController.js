import Application from "../models/Application.js";
import Campaign from "../models/Campaign.js";
import User from "../models/users.js";

export const applyToCampaign = async (req, res) => {
  try {
    const { campaignId } = req.body;
    const influencer = await User.findById(req.user.id);
    if (!influencer || influencer.role !== "Influencer")
      return res.status(403).json({ message: "Only Influencers can apply ❌" });

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) return res.status(404).json({ message: "Campaign not found ❌" });

    const application = await Application.create({ campaignId: campaign._id, userId: influencer._id });
    res.json({ message: "Application Submitted ✅", application });
  } catch (e) {
    if (e.code === 11000) return res.status(400).json({ message: "Already Applied ✅" });
    res.status(500).json({ message: "Server error", error: e.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId, status } = req.body; // "Accepted" | "Rejected"
    const brandId = req.user.id;

    const application = await Application.findById(applicationId);
    if (!application) return res.status(404).json({ message: "Application not found ❌" });

    const campaign = await Campaign.findOne({ _id: application.campaignId, brandId });
    if (!campaign) return res.status(403).json({ message: "Not your campaign ❌" });

    application.status = status;
    await application.save();
    res.json({ message: `Application ${status} ✅`, application });
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
};
