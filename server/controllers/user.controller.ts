import { Response, NextFunction } from 'express'
import { AuthenticatedRequest } from '../types/auth.type.ts'
import User from '../models/user.model.ts'
import Household from '../models/household.model.ts'
import Session from '../models/session.model.ts'
import { ServerError } from '../utils/server.error.ts'
import { ApiResponse } from '../utils/server.success.ts'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

export const getUserProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return new ServerError('User not found', 404)
        }
        
        const filter = { _id: req.user._id }

        const userProfile = await User.findOne(filter)
            .select('-password')
            .populate('households')
        
        ApiResponse.success({
            res,
            message: 'User profile retrieved successfully',
            data: { user: userProfile }
        })

    } catch (error) {
        next(error)
    }
}

export const getUserProfileById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id

        const userProfile = await User.findById(userId)
            .select('-password')
            .populate('households')

        if (!userProfile) {
            return new ServerError('User not found', 404)
        }

        ApiResponse.success({
            res,
            message: 'User profile retrieved successfully',
            data: { user: userProfile }
        })
    } catch (error) {
        next(error)
    }
}

export const getAllUserProfiles = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        // 1. Extract query parameters with sensible defaults
        const page = Number.parseInt(req.query.page as string) || 1
        const limit = Number.parseInt(req.query.limit as string) || 10
        const skip = (page - 1) * limit

        // 2. Run query and total count in parallel for maximum speed
        const [users, totalUsers] = await Promise.all([
            User.find()
                .select('-password')
                .populate('households') // Ensure 'households' matches your schema property name exactly
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }), // Show newest users first
            User.countDocuments()
        ])

        // 3. Return structured response using your ApiResponse utility
        return ApiResponse.success({
            res,
            statusCode: 200,
            message: 'Users retrieved successfully',
            data: { users },
            meta: {
                total: totalUsers,
                page,
                limit,
                totalPages: Math.ceil(totalUsers / limit)
            }
        })
    } catch (error) {
        next(error)
    }
}

export const createUserProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const session = await mongoose.startSession()
    session.startTransaction()
    
    try {
        const { fullName, email, password, role, avatarUrl, households } = req.body

        if (!fullName || !email || !password) {
            return new ServerError('Missing required fields', 400)
        }

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return new ServerError('Email already in use', 400)
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUsers = await User.create([{
            fullName,
            email,
            password: hashedPassword,
            role: role || 'Resident',
            avatarUrl, 
            households: [] 
        }], { session })

        const newUser = newUsers[0]

        if (Array.isArray(households) && households.length > 0) {
            // Attach new user's ID to each household object
            const householdDocs = households.map((h: Record<string, any>) => ({
                ...h,
                user: newUser._id
            }))

            // Bulk insert households within session
            const createdHouseholds = await Household.insertMany(householdDocs, { session })

            // Extract created household IDs and attach to user record
            const householdIds = createdHouseholds.map((h) => h._id)
            newUser.households = householdIds as any
            await newUser.save({ session })
        }

        await session.commitTransaction()
        await session.endSession()

        const userProfile = await User.findById(newUser._id)
            .select('-password')
            .populate('households')

        return ApiResponse.success({
            res,
            statusCode: 201,
            message: 'User profile created successfully',
            data: { user: userProfile }
        })

    } catch (error) {
        await session.abortTransaction()
        await session.endSession()
        next(error)
    }
}

export const updateUserProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return new ServerError('User not found', 404)
        }

        const { fullName, email, password, avatarUrl } = req.body

        if (!fullName && !email && !password && !avatarUrl) {
            return new ServerError('No data provided for update', 400)
        }

        if (email && email !== req.user.email) {
            const existingUser = await User.findOne({ email })
            if (existingUser) {
                return new ServerError('Email already in use', 400)
            }
        }

        const filter = { _id: req.user._id }

        const userProfile = await User.findOneAndUpdate(filter, { fullName, email, password, avatarUrl }, { new: true, runValidators: true })
            .select('-password')
            .populate('households')


        if (!userProfile) {
            return new ServerError('User not found', 404)
        }
        
        ApiResponse.success({
            res,
            message: 'User profile updated successfully',
            data: { user: userProfile }
        })

    } catch (error) {
        next(error)
    }
}

export const deleteUserProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const {id: targetUserId} = req.params

    if (req.user?._id.toString() === targetUserId) {
        return next(new ServerError('You cannot delete your own account', 403))
    }

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const userToDelete = await User.findById(targetUserId).session(session)
        if (!userToDelete) {
            return next(new ServerError('User not found', 404))
        }

        await Session.deleteMany({ user: targetUserId }).session(session)

        await Household.deleteMany({ user: targetUserId }).session(session)

        await User.findByIdAndDelete(targetUserId).session(session)

        await session.commitTransaction()
        await session.endSession()

        return ApiResponse.success({
            res,
            statusCode: 200,
            message: 'User profile deleted successfully'
        })
    } catch (error) {
        await session.abortTransaction()
        await session.endSession()
        next(error)
    }
}