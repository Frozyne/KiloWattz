
import type { RequestHandler } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

const authenticateToken: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1. Check whether the request contains a Bearer token.
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      message: "Authentication token is required",
    });
    return;
  }

  // 2. Extract the token from the Authorization header.
  const token = authHeader.split(" ")[1];

  // 3. Make sure the JWT secret is configured.
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    res.status(500).json({
      success: false,
      message: "Server authentication is not configured",
    });
    return;
  }

  try {
    // 4. Verify the token's signature and expiration.
    const decoded = jwt.verify(token, jwtSecret);

    // 5. Ensure the token contains the expected user ID.
    if (
      typeof decoded === "string" ||
      typeof decoded.userId !== "string" ||
      !decoded.userId
    ) {
      res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
      return;
    }

    // 6. Make the authenticated user's ID available to the controller.
    res.locals.userId = decoded.userId;

    next();
  } catch {
    res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token",
    });
  }
};

export default authenticateToken;
