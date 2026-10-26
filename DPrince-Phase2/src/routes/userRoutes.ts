
import { Router } from "express";
import authenticateToken from "../middleware/authMiddleware.js";
import { getMe } from "../controller/userController.js";

const router = Router();

// GET /api/users/me
router.get("/me", authenticateToken, getMe);


export default router;
