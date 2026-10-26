
import type { RequestHandler } from "express";
import User from "../model/User.js";

const requireAdmin: RequestHandler = async (_req, res, next) => {
  try {
    // The authentication middleware must run first.
    const userId = res.locals.userId as string | undefined;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    // Retrieve the user's current role from the database.
    const user = await User.findById(userId)
      .select("role")
      .lean();

    if (!user) {
      res.status(401).json({
        success: false,
        message: "User account not found",
      });
      return;
    }

    // Only Admin users may continue.
    if (user.role !== "admin") {
      res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
      return;
    }

    next();
  } catch (error) {
    console.error("Admin authorization error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to verify administrator access",
    });
  }
};

export default requireAdmin;
