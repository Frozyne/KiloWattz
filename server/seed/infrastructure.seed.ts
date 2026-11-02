import 'dotenv/config'
import mongoose from 'mongoose'
import connectToDB from '../config/db_config'
import Infrastructure from '../models/infrastructure.model'
import { getSeedInfrastructure } from './data/asset.data'
import { getInfrastructureModelData } from '../utils/infrastructure.helper'

const INITIAL_HARDWARE_MANIFEST = getSeedInfrastructure()

async function seed(): Promise<void> {
    try {
        await connectToDB()

        // Clear existing assets to prevent duplicate seed errors on restart
        await Infrastructure.deleteMany({})
        console.log('[SEED] Cleared existing infrastructure collection.')

        const seededAssets = []
        const tracker: Record<string, number> = {}

        for (const item of INITIAL_HARDWARE_MANIFEST) {
            const modelData = getInfrastructureModelData(item.model)
            if (!modelData) {
                console.warn(`[SEED WARNING] Unrecognized model code: ${item.model}`)
                continue
            }

            // Generate an incremental, predictable serial number for seeding (e.g., INV-SG150HX-01)
            tracker[item.model] = (tracker[item.model] || 0) + 1
            const sequenceNumber = String(tracker[item.model]).padStart(2, '0')
            const serialNumber = `${item.model}-${sequenceNumber}`

            seededAssets.push({
                serialNumber,
                name: `${modelData.name} #${sequenceNumber}`,
                modelNumber: item.model,
                type: modelData.type,
                capacityKW: modelData.capacityKW,
                capacityKWh: modelData.capacityKWh,
                status: 'Operational',
                healthPercent: 100,
                diagnostics: {
                    efficiencyPercent: 98,
                    temperatureC: 32,
                    stateOfChargePercent: modelData.type === 'BatteryBank' ? 85 : undefined
                }
            })
        }

        await Infrastructure.insertMany(seededAssets)
        console.log(`[SEED SUCCESS] Successfully seeded ${seededAssets.length} unique infrastructure assets with serial numbers.`)
    } catch (error) {
        console.error('[SEED ERROR] Failed to seed infrastructure:', error)
    }
}

seed()
    .catch((error: unknown) => {
        console.error('Seeding failed', error)
        process.exitCode = 1
    })
    .finally(async () => {
        await mongoose.disconnect()
    })