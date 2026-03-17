import { Router } from "express";
import {
  retrieveUserById,
  createUser,
  retrieveUsers,
  updateUserById,
  updateCurrentUser,
  changePassword,
} from "../controllers/user.controller.js";
import {
  registerUserValidator,
  updateUserValidator,
  updateCurrentUserValidator,
  changePasswordValidator,
} from "../validators/user.validator.js";
import { requestValidator } from "../middlewares/requestValidator.middleware.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = Router();

// Create User
router.post("/register", registerUserValidator, requestValidator, createUser);

// Update current user
router.put("/me", authenticateUser, updateCurrentUserValidator, requestValidator, updateCurrentUser);

// Change password for current user
router.put("/me/password", authenticateUser, changePasswordValidator, requestValidator, changePassword);

// Get user by ID
router.get("/:id", authenticateUser, retrieveUserById);

// Update user by ID
router.put("/:id", updateUserValidator, requestValidator, updateUserById);

// Get all users
router.get("/", retrieveUsers);

export default router;
