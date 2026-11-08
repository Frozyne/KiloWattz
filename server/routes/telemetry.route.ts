import { Router } from "express";
import { getCommunityTelemetry, getHouseholdTelemetry } from "../controllers/telemetry.controller.ts";
import { protectRoute } from "../middlewares/protect.middleware.ts";
import { authorizeUser } from "../middlewares/auth.middleware.ts";

const telemetryRouter: Router = Router()

telemetryRouter.use(protectRoute) // Apply authentication middleware to all routes  

telemetryRouter.get('/household/:id', getHouseholdTelemetry)

telemetryRouter.get('/community', authorizeUser, getCommunityTelemetry) // Admin only

export default telemetryRouter
