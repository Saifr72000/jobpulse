import type { Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwt.util.js";
import { authCookieOptions } from "../utils/authCookies.js";

export const loginUser = async (
  email: string,
  password: string,
  res: Response,
) => {
  const user = await User.findOne({ email });

  if (!user) return null;

  const isPasswordValid = await bcrypt.compare(password, user.password || "");
  if (!isPasswordValid || !user.password) return null;

  const accessToken = generateAccessToken(user._id.toString());
  const refreshToken = generateRefreshToken(user._id.toString());

  // Save refresh token in DB
  user.refreshToken = refreshToken;
  await user.save();

  res.cookie("access_token", accessToken, authCookieOptions(15 * 60 * 1000));

  res.cookie(
    "refresh_token",
    refreshToken,
    authCookieOptions(7 * 24 * 60 * 60 * 1000),
  );

  return {
    message: "Login successful",
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      ...(user.role === "admin" ? { role: "admin" as const } : {}),
    },
  };
};
