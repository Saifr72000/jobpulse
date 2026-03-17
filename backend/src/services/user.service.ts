import bcrypt from "bcrypt";
import type { IUser } from "../models/user.model.js";
import { User } from "../models/user.model.js";
import { Company } from "../models/company.model.js";
import { generateOTP } from "../utils/otp.util.js";
import type { Types } from "mongoose";

const SALT_ROUNDS = 10; //WE must consider moving this to .env file instead for security purposes

//This service is for creating users. The service is used within the controller
export const registerUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  companyId: string
) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
    return;
  }

  // here we will validate the user using email otp
  const otp = generateOTP();
  const otpExpires = new Date(Date.now() * 10 * 60 * 1000);

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    company: companyId,
  });

  await newUser.save(); // Saves user to db


  // Ensure no sensitive information is returned in the API response.
  return {
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    email: newUser.email,
    company: newUser.company,
  };
};

export const getAllUsers = async (): Promise<IUser[]> => {
  return await User.find().select("-password"); // Exclude password for security
};

export const getUserById = async (userId: string): Promise<IUser | null> => {
  return await User.findById(userId).select("-password");
};

export const getUsersByCompany = async (
  companyId: string
): Promise<IUser[]> => {
  return await User.find({ company: companyId }).select("-password");
};

export const updateUser = async (
  userId: string,
  updates: Partial<Pick<IUser, "firstName" | "lastName">>
): Promise<IUser | null> => {
  try {
    const { firstName, lastName } = updates;

    const updateData: Partial<IUser> = {};

    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password -refreshToken");
    return updatedUser;
  } catch (error) {
    throw new Error("Failed to update user");
  }
};

export const changeUserPassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<boolean> => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new Error("Current password is incorrect");
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    // Update password
    await User.findByIdAndUpdate(userId, { password: hashedPassword });

    return true;
  } catch (error) {
    throw error;
  }
};

export const createUserForCompany = async (
  companyId: string,
  firstName: string,
  lastName: string,
  email: string
): Promise<IUser> => {
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  // Verify company exists
  const company = await Company.findById(companyId);
  if (!company) {
    throw new Error("Company not found");
  }

  // Generate temporary password
  const tempPassword = Math.random().toString(36).slice(-10) + "Aa1!";
  const hashedPassword = await bcrypt.hash(tempPassword, SALT_ROUNDS);

  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    company: companyId,
    isVerified: false,
  });

  await newUser.save();

  // TODO: Send invitation email with temporary password

  return newUser;
};