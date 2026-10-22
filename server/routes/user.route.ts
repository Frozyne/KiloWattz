import {Router} from "express";
import { getAllUserProfiles, getUserProfileById, createUserProfile, updateUserProfile, deleteUserProfile, getUserProfile } from "../controllers/user.controller.ts";
import { protectRoute } from "../middlewares/protect.middleware.ts";
import { authorizeUser } from "../middlewares/auth.middleware.ts";

const userRouter = Router()

userRouter.use(protectRoute) // Apply authentication middleware to all routes

userRouter.get('/me', getUserProfile) // Authenticated user only

userRouter.get('/', authorizeUser, getAllUserProfiles) // Admin only
userRouter.get('/:id', authorizeUser, getUserProfileById) // Admin only
userRouter.post('/', authorizeUser, createUserProfile) // Admin only
userRouter.put('/:id', authorizeUser, updateUserProfile) // Admin only
userRouter.delete('/:id', authorizeUser, deleteUserProfile) // Admin only