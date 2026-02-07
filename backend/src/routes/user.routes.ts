import { Router } from "express";
import {
  retrieveUserById,
  createUser,
  retrieveUsers,
  updateUserById,
} from "../controllers/user.controller.js";
import {
  registerUserValidator,
  updateUserValidator,
} from "../validators/user.validator.js";
import { requestValidator } from "../middlewares/requestValidator.middleware.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = Router();

// Create User
router.post("/register", registerUserValidator, requestValidator, createUser);

// Get user by ID
router.get("/:id", authenticateUser, retrieveUserById);

// Update user by ID
router.put("/:id", updateUserValidator, requestValidator, updateUserById);

// Get all users
router.get("/", retrieveUsers);

export default router;
