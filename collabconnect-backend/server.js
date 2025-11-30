import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import campaignRoutes from "./routes/campaign.js";
import applyRoutes from "./routes/apply.js";
import applicantRoutes from "./routes/applicants.js";
import notificationRoutes from "./routes/notification.js"; // ✅ Import kiya

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ---- MongoDB Connect ----
mongoose
  .connect(process.env.MONGO_URL, { dbName: "collabconnect" })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err.message));

// ---- Routes ----
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/campaign", campaignRoutes);
app.use("/application", applyRoutes);
app.use("/applicants", applicantRoutes);
app.use("/notifications", notificationRoutes); // ✅ Route add kiya

app.get("/", (_, res) => res.send("CollabConnect Backend Running ✅"));

const PORT = process.env.PORT || 5000; // ✅ Render ka port use karega, nahi to 5000

app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));