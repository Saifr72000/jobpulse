import { Router } from "express";
import { getDashboard } from "../controllers/dashboard.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = Router();

// GET /api/dashboard?since=YYYY-MM-DD&until=YYYY-MM-DD
router.get("/", authenticateUser, getDashboard);

export default router;
