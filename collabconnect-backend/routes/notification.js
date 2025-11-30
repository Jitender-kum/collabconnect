import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getMyNotifications, markRead } from "../controllers/notificationController.js";

const router = express.Router();

// GET: /api/notifications (Fetch all)
router.get("/", authMiddleware, getMyNotifications);

// PUT: /api/notifications/read (Mark all read)
router.put("/read", authMiddleware, markRead);

export default router;