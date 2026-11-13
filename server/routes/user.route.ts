import {Router} from "express";
import { getAllUserProfiles, getUserProfileById, createUserProfile, updateUserProfile, deleteUserProfile, getUserProfile } from "../controllers/user.controller.js";
import { protectRoute } from "../middlewares/protect.middleware.js";
import { authorizeUser } from "../middlewares/auth.middleware.js";

const userRouter: Router = Router()

userRouter.use(protectRoute) // Apply authentication middleware to all routes

userRouter.get('/', getUserProfile) // Authenticated user only

userRouter.get('/all', authorizeUser, getAllUserProfiles) // Admin only
userRouter.get('/:id', authorizeUser, getUserProfileById) // Admin only
userRouter.post('/add', authorizeUser, createUserProfile) // Admin only
userRouter.patch('/:id', authorizeUser, updateUserProfile) // Admin only
userRouter.delete('/:id', authorizeUser, deleteUserProfile) // Admin only

export default userRouter
