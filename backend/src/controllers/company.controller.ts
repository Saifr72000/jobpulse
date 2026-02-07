import type { Request, Response } from "express";
import * as companyService from "../services/company.service.js";

export const createCompany = async (req: Request, res: Response) => {
  try {
    const { name, orgNumber, email, address, phone, website } = req.body;

    const company = await companyService.createCompany(
      name,
      orgNumber,
      email,
      address,
      phone,
      website
    );

    res.status(201).json({
      message: "Company created successfully",
      company,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("already exists")) {
      res.status(409).json({ error: error.message });
      return;
    }
    console.error("Error creating company:", error);
    res.status(500).json({ error: "Failed to create company" });
  }
};

export const getCompanyById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const company = await companyService.getCompanyById(id as string);

    if (!company) {
      res.status(404).json({ error: "Company not found" });
      return;
    }

    res.status(200).json(company);
  } catch (error) {
    console.error("Error fetching company:", error);
    res.status(500).json({ error: "Failed to fetch company" });
  }
};

export const getAllCompanies = async (req: Request, res: Response) => {
  try {
    const companies = await companyService.getAllCompanies();
    res.status(200).json(companies);
  } catch (error) {
    console.error("Error fetching companies:", error);
    res.status(500).json({ error: "Failed to fetch companies" });
  }
};

export const updateCompany = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const company = await companyService.updateCompany(id as string, updateData);

    if (!company) {
      res.status(404).json({ error: "Company not found" });
      return;
    }

    res.status(200).json({
      message: "Company updated successfully",
      company,
    });
  } catch (error) {
    console.error("Error updating company:", error);
    res.status(500).json({ error: "Failed to update company" });
  }
};

export const deleteCompany = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const company = await companyService.deleteCompany(id as string);

    if (!company) {
      res.status(404).json({ error: "Company not found" });
      return;
    }

    res.status(200).json({ message: "Company deleted successfully" });
  } catch (error) {
    console.error("Error deleting company:", error);
    res.status(500).json({ error: "Failed to delete company" });
  }
};
