import type { Request, Response } from "express";
import * as companyService from "../services/company.service.js";
import { getUsersByCompany, createUserForCompany } from "../services/user.service.js";
import { User } from "../models/user.model.js";

export const createCompany = async (req: Request, res: Response) => {
  try {
    const { name, orgNumber, email, address, website } = req.body;

    const company = await companyService.createCompany(
      name,
      orgNumber,
      email,
      address,
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

// Get all users in a company
export const getCompanyUsers = async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;
    const users = await getUsersByCompany(companyId as string);

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching company users:", error);
    res.status(500).json({ error: "Failed to fetch company users" });
  }
};

// Add a user to a company
export const addCompanyUser = async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;
    const { firstName, lastName, email } = req.body;

    const newUser = await createUserForCompany(companyId as string, firstName, lastName, email);

    res.status(201).json({
      message: "User added successfully",
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("already exists")) {
      res.status(409).json({ error: error.message });
      return;
    }
    if (error instanceof Error && error.message === "Company not found") {
      res.status(404).json({ error: error.message });
      return;
    }
    console.error("Error adding user to company:", error);
    res.status(500).json({ error: "Failed to add user to company" });
  }
};

// Remove a user from a company
export const removeCompanyUser = async (req: Request, res: Response) => {
  try {
    const { companyId, userId } = req.params;
    const currentUserId = (req as any).user?.userId;

    // Prevent user from removing themselves
    if (userId === currentUserId) {
      res.status(400).json({ error: "You cannot remove yourself" });
      return;
    }

    // Verify user belongs to the company
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (user.company.toString() !== companyId) {
      res.status(403).json({ error: "User does not belong to this company" });
      return;
    }

    // Delete the user
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "User removed successfully" });
  } catch (error) {
    console.error("Error removing user from company:", error);
    res.status(500).json({ error: "Failed to remove user" });
  }
};
