import { Router } from "express";
import { loginController, refreshTokenController, logoutController } from "../controllers/auth.controller.js";

const router = Router();

// Login
router.post("/login", loginController);

// Refresh token
router.post("/refresh-token", refreshTokenController);

// Logout
router.post("/logout", logoutController);

export default router;
