import type { Request, Response } from "express-serve-static-core";
import {
  getAllUsers,
  registerUser,
  getUserById,
  getUsersByCompany,
  updateUser,
  changeUserPassword,
} from "../services/user.service.js";
import { User } from "../models/user.model.js";

export const createUser = async (request: Request, response: Response) => {
  try {
    const { firstName, lastName, email, password, companyId } = request.body;
    const user = await registerUser(firstName, lastName, email, password, companyId);

    response.status(201).json({
      message: "User registered successfully. Check your email for OTP",
      user,
    });
  } catch (error) {
    if (error instanceof Error) {
      response.status(400).json({ message: error.message });
    } else {
      response.status(400).json({ message: "An unknwn error occurred" });
    }
  }
};

export const retrieveUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving users" });
  }
};

// Retrieve user by user id controller
export const retrieveUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await getUserById(req.params.id as string); // Fetch user from DB

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user); // Send the response directly
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//Update user by user id controller
export const updateUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { firstName, lastName } = req.body;
    const updatedUser = await updateUser(id as string, { firstName, lastName });
    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Failed to update user", error });
  }
};

// Update current authenticated user
export const updateCurrentUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { firstName, lastName } = req.body;
    const updatedUser = await updateUser(userId, { firstName, lastName });

    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating current user:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

// Change password for current user
export const changePassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { currentPassword, newPassword } = req.body;

    await changeUserPassword(userId, currentPassword, newPassword);

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    if (error instanceof Error && error.message === "Current password is incorrect") {
      res.status(400).json({ message: error.message });
      return;
    }
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Failed to change password" });
  }
};

// Get current user from access token cookie
/* export const getCurrentUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // The user object is already attached to the request by the authenticateUser middleware
    if (!req.user || ! req.user.userId) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const user = await getUserById(req.user.userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Return the user data without sensitive information
    const userResponse = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      // Add any other non-sensitive fields you want to include
    };

    res.status(200).json(userResponse);
  } catch (error) {
    console.error("Error retrieving current user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}; */