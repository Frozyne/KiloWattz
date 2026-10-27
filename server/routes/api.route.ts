import { Router } from 'express'
import { getLatestEnvironment } from '../controllers/environment.controller'
import { protectRoute } from '../middlewares/protect.middleware'

const apiRouter : Router = Router()

apiRouter.use(protectRoute)

apiRouter.use('/enviroment/latest', getLatestEnvironment)

export default apiRouter