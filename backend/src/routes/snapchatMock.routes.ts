import { Router } from "express";
import { getSnapchatMockCampaignStats } from "../controllers/snapchatMock.controller.js";

const router = Router();

// Mirrors Snapchat: GET /v1/campaigns/:campaignId/stats
router.get("/v1/campaigns/:campaignId/stats", getSnapchatMockCampaignStats);

export default router;
