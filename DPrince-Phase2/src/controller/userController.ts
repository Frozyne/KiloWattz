
import type { RequestHandler } from "express";
import User from "../model/User.js";

export const getMe: RequestHandler = async (_req, res) => {
  try {
    // The authentication middleware sets this after verifying the JWT.
    const userId = res.locals.userId as string | undefined;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    // Find the authenticated user and exclude their password hash.
    const user = await User.findById(userId)
      .select("-password")
      .lean();

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    // Return only profile information.
    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        households: user.households,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve user profile",
    });
  }
};
