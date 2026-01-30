import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { create, get, list, remove, update } from "../controllers/contacts.controller";
import { contactCreateSchema, contactIdSchema, contactUpdateSchema } from "../validators/contacts";

const router = Router();

router.get("/", list);
router.get("/:id", validate(contactIdSchema), get);
router.post("/", validate(contactCreateSchema), create);
router.patch("/:id", validate(contactUpdateSchema), update);
router.delete("/:id",  validate(contactIdSchema), remove);
// router.get("/", authMiddleware(["admin", "agent"]), list);
// router.get("/:id", authMiddleware(["admin", "agent"]), validate(contactIdSchema), get);
// router.post("/", validate(contactCreateSchema), create);
// router.patch("/:id", authMiddleware(["admin", "agent"]), validate(contactUpdateSchema), update);
// router.delete("/:id", authMiddleware(["admin"]), validate(contactIdSchema), remove);

export default router;
