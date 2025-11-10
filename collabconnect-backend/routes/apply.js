import express from "express";
import { applyToCampaign } from "../controllers/applicationController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { updateApplicationStatus } from "../controllers/applicationController.js";


const router = express.Router();

router.post("/apply", verifyToken, applyToCampaign);
router.post("/update-status", verifyToken, updateApplicationStatus);

export default router;
