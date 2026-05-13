import { Router } from "express";
import {
  createCompany,
  getCompanyById,
  getAllCompanies,
  updateCompany,
  deleteCompany,
  getCompanyUsers,
  addCompanyUser,
  removeCompanyUser,
} from "../controllers/company.controller.js";
import {
  createCompanyValidator,
  updateCompanyValidator,
  addUserToCompanyValidator,
} from "../validators/company.validator.js";
import { requestValidator } from "../middlewares/requestValidator.middleware.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import {
  requireSameCompany,
  requireSameCompanyStrict,
} from "../middlewares/authorization.middleware.js";
import { requireAdmin } from "../middlewares/requireAdmin.middleware.js";

const router = Router();

// Create company (platform admin only)
router.post(
  "/",
  authenticateUser,
  requireAdmin,
  createCompanyValidator,
  requestValidator,
  createCompany,
);

// List all companies (platform admin only)
router.get("/", authenticateUser, requireAdmin, getAllCompanies);

// Get / update / delete company by ID — same company or admin
router.get("/:id", authenticateUser, requireSameCompany, getCompanyById);
router.put(
  "/:id",
  authenticateUser,
  requireSameCompany,
  updateCompanyValidator,
  requestValidator,
  updateCompany,
);
router.delete("/:id", authenticateUser, requireSameCompany, deleteCompany);

// Company-users routes — org admin of that company only (no cross-company access by platform admin)
router.get(
  "/:companyId/users",
  authenticateUser,
  requireAdmin,
  requireSameCompanyStrict,
  getCompanyUsers,
);

router.post(
  "/:companyId/users",
  authenticateUser,
  requireAdmin,
  requireSameCompanyStrict,
  addUserToCompanyValidator,
  requestValidator,
  addCompanyUser,
);

router.delete(
  "/:companyId/users/:userId",
  authenticateUser,
  requireAdmin,
  requireSameCompanyStrict,
  removeCompanyUser,
);

export default router;
