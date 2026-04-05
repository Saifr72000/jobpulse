import { Router } from "express";
import {
  getSummary,
  getTimeSeries,
  getDemographics,
  upsertToken,
} from "../controllers/reporting.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = Router();

// POST /api/reporting/tokens — insert or update a platform access token
router.post("/tokens", authenticateUser, upsertToken);

// GET /api/reporting/:orderId/summary?since=YYYY-MM-DD&until=YYYY-MM-DD
router.get("/:orderId/summary", authenticateUser, getSummary);

// GET /api/reporting/:orderId/timeseries?since=YYYY-MM-DD&until=YYYY-MM-DD
router.get("/:orderId/timeseries", authenticateUser, getTimeSeries);

// GET /api/reporting/:orderId/demographics?since=YYYY-MM-DD&until=YYYY-MM-DD
router.get("/:orderId/demographics", authenticateUser, getDemographics);

export default router;
