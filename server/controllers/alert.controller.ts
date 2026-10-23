import { Response, NextFunction } from 'express'
import mongoose from 'mongoose'
import Alert from '../models/alert.model'
import Household from '../models/household.model'
import { AuthenticatedRequest } from '../types/auth.type'
import { ApiResponse } from '../utils/server.success'
import { ServerError } from '../utils/server.error'

export const getAlerts = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { severity, scope, isResolved, page = '1', limit = '20' } = req.query

        const filterQuery: Record<string, any> = {}

        if (severity) filterQuery.severity = severity as string
        if (scope) filterQuery.scope = scope as string
        if (isResolved !== undefined) filterQuery.isResolved = isResolved === 'true'

        if (req.user?.role !== 'Admin') {
            const userHousehold = await Household.findOne({ user: req.user?._id })
            filterQuery.$or = [
                { scope: 'System' },
                { household: userHousehold?._id }
            ]
        }

        const pageNum = Math.max(1, Number.parseInt(page as string, 10))
        const limitNum = Math.max(1, Number.parseInt(limit as string, 10))
        const skip = (pageNum - 1) * limitNum

        const [alerts, totalAlerts] = await Promise.all([
            Alert.find(filterQuery)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNum)
                .populate('household', 'plotNumber street')
                .populate('resolvedBy', 'fullName email')
                .exec(),
            Alert.countDocuments(filterQuery)
        ])

        return ApiResponse.success({
            res,
            statusCode: 200,
            message: 'System alerts and logs retrieved successfully',
            data: {
                alerts,
                pagination: {
                    totalAlerts,
                    currentPage: pageNum,
                    totalPages: Math.ceil(totalAlerts / limitNum)
                }
            }
        })
    } catch (error) {
        next(error)
    }
}

export const triggerEmergencyLoadShedding = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const { reason } = req.body

        const emergencyReason = reason || 'Manual Admin Emergency SOS Triggered'

        const bulkResult = await Household.updateMany(
            { connectionStatus: 'Active' },
            { $set: { connectionStatus: 'Suspended' } },
            { session }
        )

        const [sosAlert] = await Alert.create(
            [{
                title: 'CRITICAL: Emergency Load-Shedding Initiated',
                message: `Grid load-shedding sequence activated by ${req.user?.fullName || 'Admin'}. Reason: ${emergencyReason}`,
                severity: 'Emergency',
                scope: 'System',
                isResolved: false,
                metadata: {
                    triggeredBy: req.user?._id,
                    affectedHouseholdsCount: bulkResult.modifiedCount
                }
            }],
            { session }
        )

        await session.commitTransaction()
        await session.endSession()

        return ApiResponse.success({
            res,
            statusCode: 200,
            message: 'Emergency load-shedding sequence executed successfully',
            data: {
                alert: sosAlert,
                householdsSuspended: bulkResult.modifiedCount
            }
        })
    } catch (error) {
        await session.abortTransaction()
        await session.endSession()
        next(error)
    }
}

export const resolveAlert = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params as { id: string }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new ServerError('Invalid alert ID format', 400)
        }

        const alert = await Alert.findById(id)
        if (!alert) {
            throw new ServerError(`Alert entry with ID ${id} not found`, 404)
        }

        if (alert.isResolved) {
            return ApiResponse.success({
                res,
                statusCode: 200,
                message: 'Alert is already marked as resolved',
                data: { alert }
            })
        }

        alert.isResolved = true
        alert.resolvedAt = new Date()
        alert.resolvedBy = req.user?._id

        await alert.save()

        return ApiResponse.success({
            res,
            statusCode: 200,
            message: 'Alert entry successfully marked as resolved',
            data: { alert }
        })
    } catch (error) {
        next(error)
    }
}