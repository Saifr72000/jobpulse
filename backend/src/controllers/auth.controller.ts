import type { Request, Response, NextFunction } from "express-serve-static-core";
import { User } from "../models/user.model.js";
import { loginUser } from "../services/auth.service.js";
import { generateAccessToken, verifyRefreshToken } from "../utils/jwt.util.js";
import { setPasswordWithToken } from "../services/user.service.js";

interface LoginRequestBody {
  email: string;
  password: string;
  refreshToken: string;
}

export const loginController = async (
  req: Request<{}, {}, LoginRequestBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  console.log("Login controller called from FF");
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password, res); // Pass `res` to set cookies

    if (!result) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    res.status(200).json(result);
  } catch (error) {
    next(error); // Forward error to Express error handler
  }
};

export const refreshTokenController = async (
  req: Request<{}, {}, LoginRequestBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refresh_token } = req.cookies;
    if (!refresh_token) {
      res.status(401).json({ message: "Refresh Token Required" });
      return;
    }

    const decoded = verifyRefreshToken(refresh_token);
    if (!decoded) {
      res.status(403).json({ message: "Invalid Refresh Token" });
      return;
    }
    const refreshToken = refresh_token; // referring to user model key for storing refresh token
    const user = await User.findOne({ refreshToken });
    if (!user) {
      res.status(403).json({ message: "Refresh Token Not Found" });
      return;
    }

    const newAccessToken = generateAccessToken(user._id.toString());

    res.cookie("access_token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.status(200).json({ message: "Access token refreshed" });
  } catch (error) {
    res.status(403).json({ message: "Invalid Refresh Token" });
  }
};

export const logoutController = async (req: Request, res: Response) => {
  try {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Logout failed" });
  }
};

export const getMeController = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const user = await User.findById(userId)
      .select("-password -refreshToken -otp -otpExpires")
      .populate("company", "name _id");
    
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      company: user.company ? {
        id: (user.company as any)._id,
        name: (user.company as any).name,
      } : null,
      isVerified: user.isVerified,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get user" });
  }
};

/**
 * Set password using invitation token
 * Called when user clicks magic link and sets their password
 */
export const setPasswordController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { token, newPassword } = req.body;

    await setPasswordWithToken(token, newPassword);

    res.status(200).json({
      message: "Password set successfully. You can now log in.",
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("Invalid or expired")) {
        res.status(400).json({ message: error.message });
        return;
      }
      if (error.message.includes("expired")) {
        res.status(400).json({ message: error.message });
        return;
      }
    }
    console.error("Error setting password:", error);
    res.status(500).json({ message: "Failed to set password" });
  }
};