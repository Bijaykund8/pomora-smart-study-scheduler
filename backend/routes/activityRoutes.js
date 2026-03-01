import express from "express";
import { getActivityFeed } from "../controllers/activityController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getActivityFeed);

export default router;