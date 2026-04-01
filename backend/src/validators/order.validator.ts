import { body, param } from "express-validator";
import type { RequestHandler } from "express";

const VALID_CHANNELS = ["linkedin", "facebook", "google", "snapchat", "instagram", "x"];
const VALID_ADDONS = ["lead-ads", "video-campaign", "linkedin-job-posting"];

// For validating campaign order creation
export const createOrderValidator: RequestHandler[] = [
  body("orderType")
    .notEmpty()
    .withMessage("orderType is required")
    .isIn(["custom", "package"])
    .withMessage("orderType must be 'custom' or 'package'"),

  body("package")
    .if(body("orderType").equals("package"))
    .notEmpty()
    .withMessage("package is required when orderType is 'package'")
    .isIn(["basic", "medium", "deluxe"])
    .withMessage("package must be 'basic', 'medium', or 'deluxe'"),

  body("channels")
    .isArray({ min: 1 })
    .withMessage("channels must be an array with at least one channel"),

  body("channels.*")
    .isIn(VALID_CHANNELS)
    .withMessage(`Each channel must be one of: ${VALID_CHANNELS.join(", ")}`),

  body("addons")
    .optional()
    .isArray()
    .withMessage("addons must be an array"),

  body("addons.*")
    .isIn(VALID_ADDONS)
    .withMessage(`Each addon must be one of: ${VALID_ADDONS.join(", ")}`),

  body("campaignName")
    .notEmpty()
    .withMessage("campaignName is required")
    .isString()
    .withMessage("campaignName must be a string")
    .trim(),

  body("assets")
    .notEmpty()
    .withMessage("assets is required"),

  body("assets.imageOption")
    .notEmpty()
    .withMessage("assets.imageOption is required")
    .isIn(["upload", "media-library", "team-suggest"])
    .withMessage("assets.imageOption must be 'upload', 'media-library', or 'team-suggest'"),

  body("assets.leadAdDescription")
    .custom((value, { req }) => {
      const addons: string[] = req.body.addons || [];
      if (addons.includes("lead-ads")) {
        if (!value) {
          throw new Error("assets.leadAdDescription is required when lead-ads addon is selected");
        }
        if (!["team-create", "own"].includes(value)) {
          throw new Error("assets.leadAdDescription must be 'team-create' or 'own'");
        }
      }
      return true;
    }),

  body("assets.videoMaterials")
    .custom((value, { req }) => {
      const addons: string[] = req.body.addons || [];
      if (addons.includes("video-campaign")) {
        if (!value) {
          throw new Error("assets.videoMaterials is required when video-campaign addon is selected");
        }
        if (!["upload", "media-library", "combine"].includes(value)) {
          throw new Error("assets.videoMaterials must be 'upload', 'media-library', or 'combine'");
        }
      }
      return true;
    }),

  body("assets.linkedinJobDescription")
    .custom((value, { req }) => {
      const addons: string[] = req.body.addons || [];
      if (addons.includes("linkedin-job-posting")) {
        if (!value) {
          throw new Error(
            "assets.linkedinJobDescription is required when linkedin-job-posting addon is selected"
          );
        }
        if (!["team-create", "own"].includes(value)) {
          throw new Error("assets.linkedinJobDescription must be 'team-create' or 'own'");
        }
      }
      return true;
    }),

  body("assets.linkedinScreeningQuestions")
    .custom((value, { req }) => {
      const addons: string[] = req.body.addons || [];
      if (addons.includes("linkedin-job-posting")) {
        if (!value) {
          throw new Error(
            "assets.linkedinScreeningQuestions is required when linkedin-job-posting addon is selected"
          );
        }
        if (!["team-create", "own"].includes(value)) {
          throw new Error("assets.linkedinScreeningQuestions must be 'team-create' or 'own'");
        }
      }
      return true;
    }),

  body("targetAudience")
    .notEmpty()
    .withMessage("targetAudience is required")
    .isString()
    .withMessage("targetAudience must be a string")
    .trim(),

  body("additionalNotes")
    .optional()
    .isString()
    .withMessage("additionalNotes must be a string")
    .trim(),

  body("paymentMethod")
    .notEmpty()
    .withMessage("paymentMethod is required")
    .isIn(["value-card", "card-payment", "invoice"])
    .withMessage("paymentMethod must be 'value-card', 'card-payment', or 'invoice'"),

  body("subtotal")
    .notEmpty()
    .withMessage("subtotal is required")
    .isNumeric()
    .withMessage("subtotal must be a number")
    .custom((value) => {
      if (Number(value) < 0) throw new Error("subtotal must be at least 0");
      return true;
    }),

  body("vatRate")
    .optional()
    .isNumeric()
    .withMessage("vatRate must be a number")
    .custom((value) => {
      const n = Number(value);
      if (n < 0 || n > 1) throw new Error("vatRate must be between 0 and 1");
      return true;
    }),

  body("vatAmount")
    .notEmpty()
    .withMessage("vatAmount is required")
    .isNumeric()
    .withMessage("vatAmount must be a number")
    .custom((value) => {
      if (Number(value) < 0) throw new Error("vatAmount must be at least 0");
      return true;
    }),

  body("totalAmount")
    .notEmpty()
    .withMessage("totalAmount is required")
    .isNumeric()
    .withMessage("totalAmount must be a number")
    .custom((value) => {
      if (Number(value) < 0) {
        throw new Error("totalAmount must be at least 0");
      }
      return true;
    }),

  body("lineItems")
    .isArray({ min: 1 })
    .withMessage("lineItems must be a non-empty array"),

  body("lineItems.*.type")
    .isIn(["package", "channel", "addon"])
    .withMessage("Each lineItem type must be 'package', 'channel', or 'addon'"),

  body("lineItems.*.name")
    .notEmpty()
    .withMessage("Each lineItem must have a name")
    .isString(),

  body("lineItems.*.price")
    .isNumeric()
    .withMessage("Each lineItem must have a numeric price")
    .custom((value) => {
      if (Number(value) < 0) throw new Error("lineItem price must be at least 0");
      return true;
    }),
];

// For validating order status update
export const updateOrderStatusValidator: RequestHandler[] = [
  param("id").isMongoId().withMessage("Invalid order ID format"),

  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["pending", "in-progress", "completed"])
    .withMessage("Invalid status value"),
];

// For validating order ID parameter
export const orderIdValidator: RequestHandler[] = [
  param("id").isMongoId().withMessage("Invalid order ID format"),
];
