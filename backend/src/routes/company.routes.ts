import { Router } from "express";
import {
  createCompany,
  getCompanyById,
  getAllCompanies,
  updateCompany,
  deleteCompany,
} from "../controllers/company.controller.js";
import {
  createCompanyValidator,
  updateCompanyValidator,
} from "../validators/company.validator.js";
import { requestValidator } from "../middlewares/requestValidator.middleware.js";

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

export default router;
