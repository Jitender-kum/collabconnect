import Application from "../models/Application.js";
import Notification from "../models/Notification.js"; // ✅ Model imported
import Campaign from "../models/Campaign.js";
import User from "../models/users.js";

// 1. Apply to Campaign
export const applyToCampaign = async (req, res) => {
  try {
    const { campaignId } = req.body;
    
    const influencer = await User.findById(req.user.id);
    if (!influencer || influencer.role !== "Influencer")
      return res.status(403).json({ message: "Only Influencers can apply ❌" });

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) return res.status(404).json({ message: "Campaign not found ❌" });

    // Application Create karo
    const application = await Application.create({ 
        campaignId: campaign._id, 
        userId: influencer._id 
    });

    // ✅ NEW: Brand ko Notification bhejo
    await Notification.create({
        userId: campaign.brandId, // Brand Owner ID
        message: `New Application: ${influencer.name} applied for '${campaign.title}'`,
        type: "info"
    });

    res.json({ message: "Application Submitted ✅", application });
  } catch (e) {
    if (e.code === 11000) return res.status(400).json({ message: "Already Applied ✅" });
    res.status(500).json({ message: "Server error", error: e.message });
  }
};

// 2. Update Status (Accept/Reject)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId, status } = req.body; // "Accepted" | "Rejected"
    const brandId = req.user.id;

    const application = await Application.findById(applicationId);
    if (!application) return res.status(404).json({ message: "Application not found ❌" });

    // Check karo ki ye campaign isi brand ka hai ya nahi
    const campaign = await Campaign.findOne({ _id: application.campaignId, brandId });
    if (!campaign) return res.status(403).json({ message: "Not your campaign ❌" });

    // Status Update karo
    application.status = status;
    await application.save();

    // ✅ NEW: Influencer ko Notification bhejo
    await Notification.create({
        userId: application.userId, // Applicant ID
        message: `Update: Your application for '${campaign.title}' was ${status}`,
        type: status === "Accepted" ? "success" : "alert"
    });

    res.json({ message: `Application ${status} ✅`, application });
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
};