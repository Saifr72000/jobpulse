import { body, param } from "express-validator";
import type { RequestHandler } from "express";

export const createFolderValidator: RequestHandler[] = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Folder name is required")
    .isLength({ max: 100 })
    .withMessage("Folder name must be 100 characters or fewer"),
];

export const renameFolderValidator: RequestHandler[] = [
  param("id").isMongoId().withMessage("Invalid folder ID"),
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Folder name is required")
    .isLength({ max: 100 })
    .withMessage("Folder name must be 100 characters or fewer"),
];

export const folderIdParamValidator: RequestHandler[] = [
  param("id").isMongoId().withMessage("Invalid folder ID"),
];

/** For `GET /folders/company/:companyId` */
export const folderCompanyIdParamValidator: RequestHandler[] = [
  param("companyId").isMongoId().withMessage("Invalid company ID"),
];
