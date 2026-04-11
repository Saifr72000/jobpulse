import { Router } from "express";
import { getLinkedInMockAdAnalytics } from "../controllers/linkedinMock.controller.js";

const router = Router();

/**
 * Mirrors LinkedIn: GET /rest/adAnalytics
 * Query: q, pivot, campaigns, dateRange, timeGranularity — optional `fields` (comma-separated metric names, same as live API).
 */
router.get("/adAnalytics", getLinkedInMockAdAnalytics);

export default router;
