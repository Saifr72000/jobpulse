import { Company } from "../../src/models/company.model.js";
import { User } from "../../src/models/user.model.js";
import { Product } from "../../src/models/product.model.js";
import bcrypt from "bcrypt";
import type mongoose from "mongoose";

export interface TestCompany {
  _id: mongoose.Types.ObjectId;
  name: string;
  orgNumber: number;
  email: string;
}

export interface TestUser {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string; // Plain text for login
  company: mongoose.Types.ObjectId;
}

export interface TestProduct {
  _id: mongoose.Types.ObjectId;
  name: string;
  price: number;
}

/**
 * Create a test company
 */
export const createTestCompany = async (
  overrides: Partial<TestCompany> = {}
): Promise<TestCompany> => {
  const companyData = {
    name: "Test Company",
    orgNumber: 123456789,
    email: "company@test.com",
    ...overrides,
  };

  const company = await Company.create(companyData);
  return {
    _id: company._id,
    name: company.name,
    orgNumber: company.orgNumber,
    email: company.email,
  };
};

/**
 * Create a test user with hashed password
 */
export const createTestUser = async (
  companyId: mongoose.Types.ObjectId,
  overrides: Partial<Omit<TestUser, "company">> = {}
): Promise<TestUser> => {
  const plainPassword = overrides.password || "testpassword123";
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const userData = {
    firstName: "Test",
    lastName: "User",
    email: "testuser@test.com",
    password: hashedPassword,
    company: companyId,
    isVerified: true,
    ...overrides,
    // Ensure password is always hashed in DB
  };
  userData.password = hashedPassword;

  const user = await User.create(userData);
  return {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    password: plainPassword, // Return plain text for login tests
    company: user.company,
  };
};

/**
 * Create a test product
 */
export const createTestProduct = async (
  overrides: Partial<TestProduct & { description?: string; category?: string; sku?: string }> = {}
): Promise<TestProduct> => {
  const productData = {
    name: "Test Product",
    price: 29.99,
    description: "A test product",
    inStock: true,
    ...overrides,
  };

  const product = await Product.create(productData);
  return {
    _id: product._id,
    name: product.name,
    price: product.price,
  };
};

/**
 * Create multiple test products
 */
export const createTestProducts = async (count: number = 3): Promise<TestProduct[]> => {
  const products: TestProduct[] = [];
  for (let i = 1; i <= count; i++) {
    const product = await createTestProduct({
      name: `Product ${i}`,
      price: 10 * i,
      sku: `SKU-${i}`,
    });
    products.push(product);
  }
  return products;
};
