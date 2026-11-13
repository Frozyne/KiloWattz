import { Router } from 'express'
import { getMyHouseholds, getHouseholdById, getAllHouseholds, createHousehold, updateHousehold, updateHouseholdStatus, deleteHousehold , ToggleTerminalConnection} from '../controllers/household.controller.js'
import { protectRoute } from '../middlewares/protect.middleware.js'
import { authorizeUser } from '../middlewares/auth.middleware.js'

const householdRouter: Router = Router()

householdRouter.use(protectRoute) // Apply authentication middleware to all routes

householdRouter.get('/', getMyHouseholds)
householdRouter.post('/:id/toggle-terminal', ToggleTerminalConnection)

householdRouter.get('/:id', authorizeUser, getHouseholdById) // Admin only
householdRouter.get('/all', authorizeUser, getAllHouseholds) // Admin only
householdRouter.post('/', authorizeUser, createHousehold) // Admin only
householdRouter.patch('/:id', authorizeUser, updateHousehold) // Admin only
householdRouter.patch('/:id/status', authorizeUser, updateHouseholdStatus) // Admin only
householdRouter.delete('/:id', authorizeUser, deleteHousehold) // Admin only

export default householdRouter
