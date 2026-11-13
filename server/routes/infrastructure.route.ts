import { Router } from 'express'
import { getInfrastructureStats, updateInfrastructureMaintenance, getInfrastructureByType, addNewInfrastructureAsset } from '../controllers/infrastructure.controller.js'
import { protectRoute}  from '../middlewares/protect.middleware.js'
import {authorizeUser} from '../middlewares/auth.middleware.js'
import { authorizeSuperUser } from '../middlewares/super.middleware.js'

const infrastructureRouter: Router = Router()

infrastructureRouter.use(protectRoute)

infrastructureRouter.get('/', authorizeUser, getInfrastructureStats) // Admin only
infrastructureRouter.patch('/:id', authorizeUser, updateInfrastructureMaintenance) // Admin only
infrastructureRouter.get('/type/:type', authorizeUser, getInfrastructureByType) // Admin only
infrastructureRouter.post('/', authorizeSuperUser, addNewInfrastructureAsset) // Super Admin only

export default infrastructureRouter