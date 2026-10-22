import { Router } from "express";
import { getCommunityTelemetry, getHouseholdTelemetry, getHouseholdSavings } from "../controllers/telementry.controller.ts";
import { protectRoute } from "../middlewares/protect.middleware.ts";
import { authorizeUser } from "../middlewares/auth.middleware.ts";

const telemetryRouter: Router = Router()

telemetryRouter.use(protectRoute) // Apply authentication middleware to all routes  

telemetryRouter.get('/household/:id', getHouseholdTelemetry)
telemetryRouter.get('/household/:id/savings', getHouseholdSavings)

telemetryRouter.get('/community', authorizeUser, getCommunityTelemetry) // Admin only

export default telemetryRouter