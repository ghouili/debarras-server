import { Router } from "express";
import {
  changePasswordController,
  forgotPassword,
  login,
  logout,
  me,
  refresh,
  register,
  resetPasswordController
} from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth";
import { authRateLimiter } from "../middlewares/rate-limit";
import { validate } from "../middlewares/validate";
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  logoutSchema,
  refreshSchema,
  registerSchema,
  resetPasswordSchema
} from "../validators/auth";

const router = Router();

router.post("/register", authRateLimiter, validate(registerSchema), register);
router.post("/login", authRateLimiter, validate(loginSchema), login);
router.post("/refresh", authRateLimiter, validate(refreshSchema), refresh);
router.post("/logout", authRateLimiter, validate(logoutSchema), logout);
router.get("/me", authMiddleware(), me);
router.post("/forgot-password", authRateLimiter, validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", authRateLimiter, validate(resetPasswordSchema), resetPasswordController);
router.post("/change-password", authMiddleware(), validate(changePasswordSchema), changePasswordController);

export default router;
