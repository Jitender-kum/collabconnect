import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createCampaign, listCampaigns, getBrandCampaigns } from "../controllers/campaignController.js";

const router = express.Router();

router.post("/create", authMiddleware, createCampaign);

router.get("/brand", authMiddleware, getBrandCampaigns);

// ✅ FIX: Route ko '/all' kiya taaki frontend ke call se match ho
router.get("/all", authMiddleware, listCampaigns);

export default router;