import { Router } from "express";

import authMiddleware from "../../middlewares/auth.middleware.js";
import validate from "../../middlewares/validate.middleware.js";

import authController from "./auth.controller.js";

import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  updateProfileSchema,
} from "./auth.validation.js";

const router = Router();

// --------------------------------------------------
// Public Authentication Routes
// --------------------------------------------------

router.post("/register", validate(registerSchema), authController.register);

router.post("/login", validate(loginSchema), authController.login);

router.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  authController.forgotPassword,
);

router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  authController.resetPassword,
);

// --------------------------------------------------
// Protected Authentication Routes
// --------------------------------------------------

router.use(authMiddleware);

router.post("/logout", authController.logout);

router.get("/me", authController.getCurrentUser);

router.patch(
  "/update-profile",
  validate(updateProfileSchema),
  authController.updateProfile,
);

router.patch(
  "/change-password",
  validate(changePasswordSchema),
  authController.changePassword,
);

export default router;
