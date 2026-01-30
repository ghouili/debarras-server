import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { create, get, list, remove, update } from "../controllers/users.controller";
import { userCreateSchema, userIdSchema, userUpdateSchema } from "../validators/users";

const router = Router();

router.get("/", list);
router.get("/:id", validate(userIdSchema), get);
router.post("/", validate(userCreateSchema), create);
router.patch("/:id", validate(userUpdateSchema), update);
router.delete("/:id", validate(userIdSchema), remove);
// router.get("/", authMiddleware(["admin"]), list);
// router.get("/:id", authMiddleware(["admin", "agent"]), validate(userIdSchema), get);
// router.post("/", authMiddleware(["admin"]), validate(userCreateSchema), create);
// router.patch("/:id", authMiddleware(["admin"]), validate(userUpdateSchema), update);
// router.delete("/:id", authMiddleware(["admin"]), validate(userIdSchema), remove);

export default router;
