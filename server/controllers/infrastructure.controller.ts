import { Response, NextFunction } from 'express'
import mongoose from 'mongoose'
import Infrastructure from '../models/infrastructure.model'
import { AuthenticatedRequest } from '../types/auth.type'
import { ApiResponse } from '../utils/server.success'
import { ServerError } from '../utils/server.error'


export const getInfrastructureStats = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const assets = await Infrastructure.find().sort({ type: 1, name: 1 })

        const summary = {
            totalAssets: assets.length,
            statusCounts: {
                operational: assets.filter(a => a.status === 'Operational').length,
                underMaintenance: assets.filter(a => a.status === 'UnderMaintenance').length,
                maintenanceRequired: assets.filter(a => a.status === 'MaintenanceRequired').length,
                offline: assets.filter(a => a.status === 'Offline').length
            },
            solarArrays: {
                count: assets.filter(a => a.type === 'SolarArray').length,
                totalCapacityKW: assets.filter(a => a.type === 'SolarArray').reduce((acc, a) => acc + (a.capacityKW || 0), 0)
            },
            batteryBanks: {
                count: assets.filter(a => a.type === 'BatteryBank').length,
                totalCapacityKWh: assets.filter(a => a.type === 'BatteryBank').reduce((acc, a) => acc + (a.capacityKWh || 0), 0)
            },
            inverters: {
                count: assets.filter(a => a.type === 'Inverter').length,
                totalCapacityKW: assets.filter(a => a.type === 'Inverter').reduce((acc, a) => acc + (a.capacityKW || 0), 0)
            }
        }

        return ApiResponse.success({
            res,
            statusCode: 200,
            message: 'Infrastructure diagnostic stats retrieved successfully',
            data: { summary, assets }
        })
    } catch (error) {
        next(error)
    }
}

export const updateInfrastructureMaintenance = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params as { id: string }
        const { status, notes, performedBy, healthPercent } = req.body

        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new ServerError('Invalid infrastructure asset ID format', 400)
        }

        if (!status || !notes) {
            throw new ServerError('Missing required fields (status, notes)', 400)
        }

        const validStatuses = ['Operational', 'MaintenanceRequired', 'UnderMaintenance', 'Offline']
        if (!validStatuses.includes(status)) {
            throw new ServerError(`Status must be one of: ${validStatuses.join(', ')}`, 400)
        }

        const asset = await Infrastructure.findById(id)
        if (!asset) {
            throw new ServerError(`Infrastructure asset with ID ${id} not found`, 404)
        }

        const technicianName = performedBy || req.user?.fullName || 'Admin'
        const now = new Date()

        asset.maintenanceLogs.push({
            performedAt: now,
            performedBy: technicianName,
            notes,
            statusAfter: status
        })

        asset.status = status
        asset.lastMaintenanceDate = now

        if (typeof healthPercent === 'number' && healthPercent >= 0 && healthPercent <= 100) {
            asset.healthPercent = healthPercent
        }

        await asset.save()

        return ApiResponse.success({
            res,
            statusCode: 200,
            message: 'Hardware maintenance log recorded successfully',
            data: { asset }
        })
    } catch (error) {
        next(error)
    }
}