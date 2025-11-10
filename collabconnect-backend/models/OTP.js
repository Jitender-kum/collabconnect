import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: String,
  code: String,
  createdAt: { type: Date, default: Date.now, expires: 300 } 
  // OTP auto delete after 5 minutes ⏳
});

export default mongoose.model("OTP", otpSchema);
