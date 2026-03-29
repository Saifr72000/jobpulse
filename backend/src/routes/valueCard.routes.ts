import { Router } from "express";
import { getTiers, getAccount, purchase } from "../controllers/valueCard.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { requestValidator } from "../middlewares/requestValidator.middleware.js";
import { purchaseValueCardValidator } from "../validators/valueCard.validator.js";

const router = Router();

router.get("/tiers", getTiers);
router.get("/account", authenticateUser, getAccount);
router.post(
  "/purchase",
  authenticateUser,
  purchaseValueCardValidator,
  requestValidator,
  purchase
);

export default router;
