import { Router } from "express";
import authRoutes from "./auth.routes";
import usersRoutes from "./users.routes";
import contactsRoutes from "./contacts.routes";
import devisRoutes from "./devis.routes";
import emailsRoutes from "./emails.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/contacts", contactsRoutes);
router.use("/devis", devisRoutes);
router.use("/emails", emailsRoutes);

export default router;
