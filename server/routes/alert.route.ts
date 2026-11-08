import { Router } from "express";
import { getAlerts, resolveAlert, triggerEmergencyLoadShedding, resolveEmergencyLoadShedding } from "../controllers/alert.controller";
import { protectRoute } from "../middlewares/protect.middleware";
import { authorizeUser } from "../middlewares/auth.middleware";

const alertRouter: Router = Router()

alertRouter.use(protectRoute)

alertRouter.get('/', getAlerts)

alertRouter.patch('/resolve/:id', authorizeUser, resolveAlert)
alertRouter.post('/els', authorizeUser, triggerEmergencyLoadShedding)
alertRouter.get('/els/resolve', authorizeUser, resolveEmergencyLoadShedding)

export default alertRouter