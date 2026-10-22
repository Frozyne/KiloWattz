import { Router } from 'express'
import { getMyHouseholds, getHouseholdById, getAllHouseholds, createHousehold, updateHousehold, deleteHousehold } from '../controllers/household.controller.ts'

const householdRouter: Router = Router()

householdRouter.get('/', getMyHouseholds)

householdRouter.get('/:id', getHouseholdById)
householdRouter.get('/all', getAllHouseholds)
householdRouter.post('/', createHousehold)
householdRouter.put('/:id', updateHousehold)
householdRouter.delete('/:id', deleteHousehold)

export default householdRouter