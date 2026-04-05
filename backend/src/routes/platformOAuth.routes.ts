import { Router } from "express";
import {
  metaOAuthRedirect,
  metaOAuthCallback,
} from "../controllers/platformOAuth.controller.js";

const router = Router();

// Open in browser to start Meta OAuth flow
router.get("/meta", metaOAuthRedirect);

// Meta redirects back here with ?code=XXX
router.get("/meta/callback", metaOAuthCallback);

export default router;
