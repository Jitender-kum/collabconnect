import express from "express";
import { getApplicantsForBrand } from "../controllers/viewApplicationsController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/brand", verifyToken, getApplicantsForBrand);

export default router;
