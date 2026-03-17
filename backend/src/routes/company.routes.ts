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
import { requireSameCompany } from "../middlewares/authorization.middleware.js";

const router = Router();

// Create company
router.post("/", createCompanyValidator, requestValidator, createCompany);

// Get all companies
router.get("/", getAllCompanies);

// Get company by ID
router.get("/:id", getCompanyById);

// Update company
router.put("/:id", updateCompanyValidator, requestValidator, updateCompany);

// Delete company
router.delete("/:id", deleteCompany);

// Company-users routes
// Get all users in a company
router.get("/:companyId/users", authenticateUser, requireSameCompany, getCompanyUsers);

// Add user to company
router.post("/:companyId/users", authenticateUser, requireSameCompany, addUserToCompanyValidator, requestValidator, addCompanyUser);

// Remove user from company
router.delete("/:companyId/users/:userId", authenticateUser, requireSameCompany, removeCompanyUser);

export default router;
