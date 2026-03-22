import { Router } from "express";
import {
  createFolder,
  getFoldersByCompany,
  renameFolder,
  deleteFolder,
} from "../controllers/folder.controller.js";
import {
  createFolderValidator,
  renameFolderValidator,
  folderIdParamValidator,
} from "../validators/folder.validator.js";
import { param } from "express-validator";
import { requestValidator } from "../middlewares/requestValidator.middleware.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = Router();

// Create a folder (companyId resolved from authenticated user)
router.post("/", authenticateUser, createFolderValidator, requestValidator, createFolder);

// Get all folders for a company
router.get(
  "/company/:companyId",
  authenticateUser,
  [param("companyId").isMongoId().withMessage("Invalid company ID")],
  requestValidator,
  getFoldersByCompany
);

// Rename a folder
router.patch("/:id", authenticateUser, renameFolderValidator, requestValidator, renameFolder);

// Delete a folder (files inside are moved to root, not deleted)
router.delete("/:id", authenticateUser, folderIdParamValidator, requestValidator, deleteFolder);

export default router;
