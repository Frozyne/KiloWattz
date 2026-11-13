import { Router } from 'express'
import { getLatestEnvironment } from '../controllers/environment.controller.js'
import { protectRoute } from '../middlewares/protect.middleware.js'

const apiRouter : Router = Router()

apiRouter.use(protectRoute)

apiRouter.get('/enviroment/latest', getLatestEnvironment)

export default apiRouter