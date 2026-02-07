import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import { getStats } from "../controllers/dashboard.controller";

const router = Router();

router.get("/", authMiddleware(["admin"]), getStats);

export default router;
