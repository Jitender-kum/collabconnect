import mongoose from "mongoose";

const socialSchema = new mongoose.Schema(
  {
    instagram: { type: String, trim: true },
    youtube:   { type: String, trim: true },
    twitter:   { type: String, trim: true },
    facebook:  { type: String, trim: true },
  },
  { _id: false }
);

// ✅ Correct follower count schema (name: followerSchema)
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

    
    name: { type: String, trim: true },
    niche: { type: String, trim: true },
    
    brandName: { type: String, trim: true },
    website: { type: String, trim: true },
    
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false },

    role: { type: String, enum: ["Influencer", "Brand"], required: true },
    
    profilePhoto: { type: String, default: "" }, // URL of uploaded image
    socialLinks: [
  {
    platform: String,
    url: String,
    followers: Number
  }
],


    // ✅ FIX: now we're actually referencing followerSchema correctly
    followerCounts: { type: followerSchema, default: {} },

    // Optional reach score field
    reachScore: { type: Number, default: 0 }
  },
  { timestamps: true }
);

// ✅ Optional calculated virtual
userSchema.virtual("totalFollowers").get(function () {
  const f = this.followerCounts || {};
  return (f.instagram || 0) + (f.youtube || 0) + (f.twitter || 0) + (f.facebook || 0);
});

export default mongoose.model("User", userSchema);
