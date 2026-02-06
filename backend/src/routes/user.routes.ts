import { Router } from "express";
import {
  retrieveUserById,
  createUser,
  retrieveUsers,
  updateUserById,
  /* getCurrentUser, */
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

// Get current authenticated user (must come before other routes to avoid being treated as an ID)
/* router.get("/me", authenticateUser, getCurrentUser); */

// Get user by user id
router.get("/:id", authenticateUser, retrieveUserById);

// Update user by user id
router.put("/:id", updateUserValidator, requestValidator, updateUserById);

// Get all users
router.get("/", requestValidator, retrieveUsers);

export default router;