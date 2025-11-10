import express from "express";
import { getApplicantsForBrand } from "../controllers/viewApplicationsController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/brand", authMiddleware, getApplicantsForBrand);

export default router;
