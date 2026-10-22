import { Router } from 'express'
import { getMyHouseholds, getHouseholdById, getAllHouseholds, createHousehold, updateHousehold, deleteHousehold } from '../controllers/household.controller.ts'
import { protectRoute } from '../middlewares/protect.middleware.ts'
import { authorizeUser } from '../middlewares/auth.middleware.ts'

const householdRouter: Router = Router()

householdRouter.use(protectRoute) // Apply authentication middleware to all routes

householdRouter.get('/', getMyHouseholds)

householdRouter.get('/:id', authorizeUser, getHouseholdById) // Admin only
householdRouter.get('/all', authorizeUser, getAllHouseholds) // Admin only
householdRouter.post('/', authorizeUser, createHousehold) // Admin only
householdRouter.put('/:id', authorizeUser, updateHousehold) // Admin only
householdRouter.delete('/:id', authorizeUser, deleteHousehold) // Admin only

export default householdRouter