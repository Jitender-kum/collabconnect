import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign", required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    status: { type: String, enum: ["Applied", "Accepted", "Rejected"], default: "Applied" },
  },
  { timestamps: true }
);

// Prevent duplicate apply by same user on same campaign
applicationSchema.index({ campaignId: 1, userId: 1 }, { unique: true });

export default mongoose.model("Application", applicationSchema);
