import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createCampaign, listCampaigns } from "../controllers/campaignController.js";

const router = express.Router();

router.post("/create", authMiddleware, createCampaign);
router.get("/", authMiddleware, listCampaigns);

export default router;
