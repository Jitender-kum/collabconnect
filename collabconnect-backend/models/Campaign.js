import mongoose from "mongoose";

const CampaignSchema = new mongoose.Schema({
  brandId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  budget: { type: String, default: "" },
  niche: { type: String, default: "" },
}, { timestamps: true });

// ✅ 100% FIX: Prevent OverwriteModelError
export default mongoose.models.Campaign || mongoose.model("Campaign", CampaignSchema);
