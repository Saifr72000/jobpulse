import { Company, type ICompany } from "../models/company.model.js";

export const createCompany = async (
  name: string,
  orgNumber: number,
  email: string,
  address?: string,
  phone?: string,
  website?: string
) => {
  // Check if company with same orgNumber or email already exists
  const existingCompany = await Company.findOne({
    $or: [{ orgNumber }, { email }],
  });

  if (existingCompany) {
    throw new Error("Company with this organization number or email already exists");
  }

  const newCompany = new Company({
    name,
    orgNumber,
    email,
    address,
    phone,
    website,
  });

  await newCompany.save();
  return newCompany;
};

export const getCompanyById = async (companyId: string): Promise<ICompany | null> => {
  return await Company.findById(companyId);
};

export const getAllCompanies = async (): Promise<ICompany[]> => {
  return await Company.find();
};

export const updateCompany = async (
  companyId: string,
  updateData: Partial<ICompany>
): Promise<ICompany | null> => {
  return await Company.findByIdAndUpdate(companyId, updateData, { new: true });
};

export const deleteCompany = async (companyId: string): Promise<ICompany | null> => {
  return await Company.findByIdAndDelete(companyId);
};
