import { Router } from 'express'
import { getTodayQuotaStatus } from '../controllers/quota.controller.ts'
import { protectRoute } from '../middlewares/protect.middleware.ts'

const quotaRouter: Router = Router()

quotaRouter.use(protectRoute) // Apply authentication middleware to all routes

quotaRouter.get('/:householdId', getTodayQuotaStatus) // Admin or owner only

export default quotaRouter