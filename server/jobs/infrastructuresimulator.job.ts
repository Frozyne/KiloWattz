import cron from 'node-cron'
import Infrastructure from '../models/infrastructure.model'
import Environment from '../models/environment.model'

export const startInfrastructureSimulatorCron = () => {
    // Runs every 1 minute
    cron.schedule('* * * * *', async () => {
        try {
            // 1. Get the latest weather conditions
            const latestEnv = await Environment.findOne().sort({ timestamp: -1 })
            if (!latestEnv) return

            // 2. Fetch all operational infrastructure assets
            const assets = await Infrastructure.find({ status: 'Operational' })

            for (const asset of assets) {
                let updatedDiagnostics = { ...asset.diagnostics }

                if (asset.type === 'SolarArray') {
                    // Solar panels lose efficiency as temperature rises above 25°C
                    const tempCoefficientPenalty = Math.max(0, (latestEnv.temperatureC - 25) * 0.4);
                    const efficiency = Math.max(75, Math.min(98, 98 - tempCoefficientPenalty));
                    
                    const currentOutput = Math.round((asset.capacityKW || 50) * (latestEnv.solarIrradiance / 1000) * (efficiency / 100));

                    updatedDiagnostics.efficiencyPercent = Math.round(efficiency);
                    updatedDiagnostics.currentOutputKW = currentOutput;
                    updatedDiagnostics.temperatureC = latestEnv.temperatureC + 10; // Panels get hotter than ambient air

                } else if (asset.type === 'Inverter') {
                    // Inverters run around 95-97% efficiency under load
                    updatedDiagnostics.efficiencyPercent = 96;
                    updatedDiagnostics.voltageV = Math.floor(Math.random() * (242 - 228 + 1) + 228); // Stable ~230V
                    updatedDiagnostics.temperatureC = Math.floor(Math.random() * (55 - 45 + 1) + 45);

                } else if (asset.type === 'BatteryBank') {
                    // Simulate battery state of charge fluctuating slightly
                    const currentSoC = updatedDiagnostics.stateOfChargePercent ?? 85;
                    const simulatedDelta = Math.random() > 0.5 ? 1 : -1;
                    const newSoC = Math.max(15, Math.min(100, currentSoC + simulatedDelta));

                    updatedDiagnostics.stateOfChargePercent = newSoC;
                    updatedDiagnostics.temperatureC = 30;
                }

                // 3. Update the individual asset in MongoDB
                asset.diagnostics = updatedDiagnostics
                await asset.save()
            }

            console.log(`[CRON] Updated diagnostics for ${assets.length} infrastructure assets.`)
        } catch (error) {
            console.error('[CRON ERROR] Failed to simulate infrastructure:', error)
        }
    })
}