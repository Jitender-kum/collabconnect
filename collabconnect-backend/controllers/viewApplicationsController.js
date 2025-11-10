import Application from "../models/Application.js";
import Campaign from "../models/Campaign.js";
import User from "../models/users.js";

export const getApplicantsForBrand = async (req, res) => {
  try {
    const brandId = req.user.id;
    const brand = await User.findById(brandId);
    if (!brand || brand.role !== "Brand")
      return res.status(403).json({ message: "Only Brands can view applicants ❌" });

    const campaigns = await Campaign.find({ brandId }).sort({ createdAt: -1 });

    const items = await Promise.all(
      campaigns.map(async (c) => {
        const apps = await Application.find({
          campaignId: c._id,
          // status: { $ne: "Rejected" } // Commented out to see all applicants including rejected if needed
        })
          .sort({ createdAt: -1 })
          .populate("userId", "name niche socialLinks followerCounts reachScore");

        return {
          campaignId: c._id,
          campaignTitle: c.title,
          applicants: apps.map((a) => ({
            applicationId: a._id,
            influencerId: a.userId?._id, // ✅ ADDED THIS LINE
            influencerName: a.userId?.name,
            influencerNiche: a.userId?.niche,
            socialLinks: a.userId?.socialLinks || [],
            followerCounts: a.userId?.followerCounts || {},
            reachScore: a.userId?.reachScore || 0,
            status: a.status,
          })),
        };
      })
    );

    res.json(items);
  } catch (error) {
    console.error("Error fetching applicants:", error);
    res.status(500).json({ message: "Server Error" });
  }
};