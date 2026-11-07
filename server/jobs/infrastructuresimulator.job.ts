import { CronJob } from 'cron'
import { Server } from 'socket.io'
import Infrastructure from '../models/infrastructure.model'
import Environment from '../models/environment.model'

export const createInfrastructureSimulatorCron = (io: Server) => {
    return new CronJob(
        '* * * * *',
        async () => {
            try {
                const latestEnv = await Environment.findOne().sort({ timestamp: -1 })
                if (!latestEnv) {
                    console.log('[CRON INFRASTRUCTURE] Skipped: No environment data found.')
                    return
                }

                const assets = await Infrastructure.find({ status: 'Operational' })
                if (!assets.length) {
                    console.log('[CRON INFRASTRUCTURE] Skipped: No operational assets found.')
                    return
                }

                for (const asset of assets) {
                    let updatedDiagnostics = { ...asset.diagnostics }

                    if (asset.type === 'SolarArray') {
                        const tempCoefficientPenalty = Math.max(0, (latestEnv.temperatureC - 25) * 0.4)
                        const efficiency = Math.max(75, Math.min(98, 98 - tempCoefficientPenalty))
                        const currentOutput = Math.round((asset.capacityKW || 50) * (latestEnv.solarIrradiance / 1000) * (efficiency / 100))

                        updatedDiagnostics.efficiencyPercent = Math.round(efficiency)
                        updatedDiagnostics.currentOutputKW = currentOutput
                        updatedDiagnostics.temperatureC = latestEnv.temperatureC + 10
                    } else if (asset.type === 'Inverter') {
                        updatedDiagnostics.efficiencyPercent = 96
                        updatedDiagnostics.voltageV = Math.floor(Math.random() * (242 - 228 + 1) + 228)
                        updatedDiagnostics.temperatureC = Math.floor(Math.random() * (55 - 45 + 1) + 45)
                    } else if (asset.type === 'BatteryBank') {
                        const currentSoC = updatedDiagnostics.stateOfChargePercent ?? 85
                        const simulatedDelta = Math.random() > 0.5 ? 1 : -1
                        const newSoC = Math.max(15, Math.min(100, currentSoC + simulatedDelta))

                        updatedDiagnostics.stateOfChargePercent = newSoC
                        updatedDiagnostics.temperatureC = 30
                    }

                    asset.diagnostics = updatedDiagnostics
                    await asset.save()

                    io.emit('infrastructure:updated', {
                        assetId: asset._id,
                        serialNumber: asset.serialNumber,
                        status: asset.status,
                        diagnostics: asset.diagnostics,
                    })
                }

                console.log(`[CRON] Updated diagnostics for ${assets.length} infrastructure assets.`)
            } catch (error) {
                console.error('[CRON ERROR] Failed to simulate infrastructure:', error)
            }
        },
        null,
        false, // Set start to false
        'Africa/Lagos'
    )
}