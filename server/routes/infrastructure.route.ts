import { Router } from 'express'
import { getInfrastructureStats, updateInfrastructureMaintenance, getInfrastructureByType, addNewInfrastructureAsset } from '../controllers/infrastructure.controller'
import { protectRoute}  from '../middlewares/protect.middleware'
import {authorizeUser} from '../middlewares/auth.middleware'
import { authorizeSuperUser } from '../middlewares/super.middleware'

const infrastructureRouter: Router = Router()

infrastructureRouter.use(protectRoute)

infrastructureRouter.get('/', authorizeUser, getInfrastructureStats) // Admin only
infrastructureRouter.patch('/:id', authorizeUser, updateInfrastructureMaintenance) // Admin only
infrastructureRouter.get('/type/:type', authorizeUser, getInfrastructureByType) // Admin only
infrastructureRouter.post('/', authorizeSuperUser, addNewInfrastructureAsset) // Super Admin only

export default infrastructureRouter