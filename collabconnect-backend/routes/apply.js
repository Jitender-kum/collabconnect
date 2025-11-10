import express from "express";
import { applyToCampaign } from "../controllers/applicationController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { updateApplicationStatus } from "../controllers/applicationController.js";


const router = express.Router();

router.post("/apply", authMiddleware, applyToCampaign);
router.post("/update-status", authMiddleware, updateApplicationStatus);

export default router;
