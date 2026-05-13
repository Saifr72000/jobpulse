import { Router } from "express";
import {
  getSummary,
  getTimeSeries,
  getDemographics,
  upsertToken,
} from "../controllers/reporting.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { requireOrderAccess } from "../middlewares/authorization.middleware.js";
import { requireAdmin } from "../middlewares/requireAdmin.middleware.js";

const router = Router();

// POST /api/reporting/tokens — insert or update a platform access token (platform admin only)
router.post("/tokens", authenticateUser, requireAdmin, upsertToken);

// GET /api/reporting/:orderId/summary?since=YYYY-MM-DD&until=YYYY-MM-DD
router.get(
  "/:orderId/summary",
  authenticateUser,
  requireOrderAccess("orderId"),
  getSummary,
);

// GET /api/reporting/:orderId/timeseries?since=YYYY-MM-DD&until=YYYY-MM-DD
router.get(
  "/:orderId/timeseries",
  authenticateUser,
  requireOrderAccess("orderId"),
  getTimeSeries,
);

// GET /api/reporting/:orderId/demographics?since=YYYY-MM-DD&until=YYYY-MM-DD
router.get(
  "/:orderId/demographics",
  authenticateUser,
  requireOrderAccess("orderId"),
  getDemographics,
);

export default router;
