import { Router } from "express";
import { getAlerts, resolveAlert, triggerEmergencyLoadShedding } from "../controllers/alert.controller";
import { protectRoute } from "../middlewares/protect.middleware";
import { authorizeUser } from "../middlewares/auth.middleware";

const alertRouter: Router = Router()

alertRouter.use(protectRoute)

alertRouter.use('/', getAlerts)

alertRouter.use('/resolve/:id', authorizeUser, resolveAlert)
alertRouter.use('/els', authorizeUser, triggerEmergencyLoadShedding)

export default alertRouter