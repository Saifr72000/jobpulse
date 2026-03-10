import { Router } from "express";
import { loginController, refreshTokenController, logoutController, getMeController } from "../controllers/auth.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = Router();

// Login
router.post("/login", loginController);

// Get current user
router.get("/me", authenticateUser, getMeController);

// Refresh token
router.post("/refresh-token", refreshTokenController);

// Logout
router.post("/logout", logoutController);

export default router;
