import { Response, NextFunction } from 'express'
import mongoose from 'mongoose'
import Infrastructure from '../models/infrastructure.model'
import { AuthenticatedRequest } from '../types/auth.type'
import { ApiResponse } from '../utils/server.success'
import { ServerError } from '../utils/server.error'
import { getInfrastructureModelData } from '../utils/infrastructure.helper'
import { generateAssetSerialNumber } from '../utils/asset.helper'

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
        if (!asset?.maintenanceLogs) {
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

export const getInfrastructureByType = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { type } = req.params as { type: 'SolarArray' | 'Inverter' | 'BatteryBank' | 'Transformer' | 'Gateway' }

        const validTypes = ['SolarArray', 'Inverter', 'BatteryBank', 'Transformer', 'Gateway']
        if (!validTypes.includes(type)) {
            throw new ServerError(`Type must be one of: ${validTypes.join(', ')}`, 400)
        }
        
        const assets = await Infrastructure.find({ type })
        return ApiResponse.success({
            res,
            statusCode: 200,
            message: 'Infrastructure assets retrieved successfully',
            data: { assets }
        })
    } catch (error) {
        next(error)
    }
}

export const addNewInfrastructureAsset = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { modelNumber, status, notes } = req.body

        if (!modelNumber || !status || !notes) {
            throw new ServerError('Missing required fields (modelNumber, status, notes)', 400)
        }

        const modelData = getInfrastructureModelData(modelNumber)
        if (!modelData) {
            throw new ServerError(`Model number ${modelNumber} is not recognized`, 400)
        }

        const serialNumber = await generateAssetSerialNumber(modelNumber)

        const asset = new Infrastructure({
            name: modelData.name,
            modelNumber: modelNumber,
            serialNumber: serialNumber,
            type: modelData.type,
            capacityKW: modelData.capacityKW,
            capacityKWh: modelData.capacityKWh,
            status: status,
            healthPercent: 100,
            lastMaintenanceDate: new Date(),
            diagnostics: {},
            maintenanceLogs: []
        })

        await asset.save()

        return ApiResponse.success({
            res,
            statusCode: 201,
            message: 'Infrastructure asset created successfully',
            data: { asset }
        })
    } catch (error) {
        next(error)
    }
}
