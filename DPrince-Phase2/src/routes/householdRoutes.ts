
import { Router } from "express";
import authenticateToken from "../middleware/authMiddleware.js";
import requireAdmin from "../middleware/adminMiddleware.js";
import { getHouseholds } from "../controller/householdController.js";

const router = Router();

router.get("/", authenticateToken, requireAdmin, getHouseholds);

export default router;
