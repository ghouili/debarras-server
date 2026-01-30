import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { create, get, list, remove, update } from "../controllers/emails.controller";
import { emailCreateSchema, emailIdSchema, emailUpdateSchema } from "../validators/emails";

const router = Router();

router.get("/", authMiddleware(["admin", "agent"]), list);
router.get("/:id", authMiddleware(["admin", "agent"]), validate(emailIdSchema), get);
router.post("/", authMiddleware(["admin", "agent"]), validate(emailCreateSchema), create);
router.patch("/:id", authMiddleware(["admin"]), validate(emailUpdateSchema), update);
router.delete("/:id", authMiddleware(["admin"]), validate(emailIdSchema), remove);

export default router;
