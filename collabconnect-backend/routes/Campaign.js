import mongoose from "mongoose";

const CampaignSchema = new mongoose.Schema({
  brandId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: String,
  budget: String,
  niche: String
}, { timestamps: true });

// ✅ Fix Overwrite Error
export default mongoose.models.Campaign || mongoose.model("Campaign", CampaignSchema);
