import { Router } from 'express'
import { getInfrastructureStats, updateInfrastructureMaintenance } from '../controllers/infrastructure.controller'
import { protectRoute}  from '../middlewares/protect.middleware'
import {authorizeUser} from '../middlewares/auth.middleware'

const infrastructureRouter: Router = Router()

infrastructureRouter.use(protectRoute)
infrastructureRouter.use(authorizeUser)

infrastructureRouter.get('/', getInfrastructureStats) // Admin only
infrastructureRouter.put('/:id', updateInfrastructureMaintenance) // Admin only

export default infrastructureRouter