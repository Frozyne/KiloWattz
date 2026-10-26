
import { Router } from "express";
import authenticateToken from "../middleware/authMiddleware.js";
import requireAdmin from "../middleware/adminMiddleware.js";
import { getInfrastructure } from "../controller/infrastructureController.js";

const router = Router();

router.get("/", authenticateToken, requireAdmin, getInfrastructure);

export default router;
