import { Router } from "express";
import { loginController, refreshTokenController, logoutController, getMeController, setPasswordController } from "../controllers/auth.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { setPasswordValidator } from "../validators/auth.validator.js";
import { requestValidator } from "../middlewares/requestValidator.middleware.js";

const router = Router();

// Login
router.post("/login", loginController);

// Get current user
router.get("/me", authenticateUser, getMeController);

// Set password with invitation token
router.post("/set-password", setPasswordValidator, requestValidator, setPasswordController);

// Refresh token
router.post("/refresh-token", refreshTokenController);

// Logout
router.post("/logout", logoutController);

export default router;
