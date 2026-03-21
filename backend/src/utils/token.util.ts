import crypto from "crypto";

/**
 * Generate a secure random token for user invitations
 * Returns a 64-character hexadecimal string
 */
export const generateInviteToken = (): string => {
  return crypto.randomBytes(32).toString("hex");
};
