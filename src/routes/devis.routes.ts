import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { create, get, list, remove, update } from "../controllers/devis.controller";
import { devisCreateSchema, devisIdSchema, devisUpdateSchema } from "../validators/devis";

const router = Router();

router.get("/", authMiddleware(["admin", "agent"]), list);
router.get("/:id", authMiddleware(["admin", "agent"]), validate(devisIdSchema), get);
router.post("/", validate(devisCreateSchema), create);
router.patch("/:id", authMiddleware(["admin", "agent"]), validate(devisUpdateSchema), update);
router.delete("/:id", authMiddleware(["admin"]), validate(devisIdSchema), remove);

export default router;
