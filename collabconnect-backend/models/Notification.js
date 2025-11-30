import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Kisko notification dikhana hai
  message: { type: String, required: true }, // Kya hua?
  type: { type: String, enum: ["info", "success", "alert"], default: "info" }, // Styling ke liye
  isRead: { type: Boolean, default: false }, // Padha ya nahi?
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Notification", notificationSchema);