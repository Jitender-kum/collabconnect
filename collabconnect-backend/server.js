import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import campaignRoutes from "./routes/Campaign.js";
import applyRoutes from "./routes/apply.js";
import applicantRoutes from "./routes/applicants.js";

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

app.get("/", (_, res) => res.send("CollabConnect Backend Running ✅"));

app.listen(5000, () => console.log("🚀 Server is running on port 5000"));
