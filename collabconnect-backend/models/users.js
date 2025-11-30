import mongoose from "mongoose";

// ✅ Follower Counts Schema (Separate object for easy stats)
const followerSchema = new mongoose.Schema(
  {
    instagram: { type: Number, default: 0, min: 0 },
    youtube:   { type: Number, default: 0, min: 0 },
    twitter:   { type: Number, default: 0, min: 0 },
    facebook:  { type: Number, default: 0, min: 0 },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    // --- Common Fields ---
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["Influencer", "Brand"], required: true },
    
    // ✅ CRITICAL FIX: Default 'true' kar diya taaki OTP ke bina direct login chale
    verified: { type: Boolean, default: true },

    // --- Influencer Fields ---
    name: { type: String, trim: true },
    niche: { type: String, trim: true },
    profilePhoto: { type: String, default: "" }, // URL of uploaded image

    // --- Brand Fields ---
    brandName: { type: String, trim: true },
    website: { type: String, trim: true },

    // --- Social Data ---
    // Flexible array for displaying links on profile
    socialLinks: [
      {
        platform: String,
        url: String,
        followers: Number
      }
    ],

    // Fixed object for easy calculations (Reach Score etc.)
    followerCounts: { type: followerSchema, default: {} },

    // Calculated Reach Score
    reachScore: { type: Number, default: 0 }
  },
  { timestamps: true }
);

// ✅ Virtual Field: Total Followers (Auto-calculate karta hai)
userSchema.virtual("totalFollowers").get(function () {
  const f = this.followerCounts || {};
  return (f.instagram || 0) + (f.youtube || 0) + (f.twitter || 0) + (f.facebook || 0);
});

export default mongoose.model("User", userSchema);