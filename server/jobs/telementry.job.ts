import cron from 'node-cron'
import Household from '../models/household.model'
// Import your controller function directly
import { recordTelemetry } from '../controllers/telemetry.controller' 

export const startHouseholdTelemetryCron = () => {
    // Runs every 1 minute
    cron.schedule('* * * * *', async () => {
        try {
            // 1. Find all active households
            const activeHouseholds = await Household.find({ connectionStatus: 'Active' })
            if (activeHouseholds.length === 0) return

            console.log(`[CRON] Simulating telemetry ingestion for ${activeHouseholds.length} households...`)

            for (const household of activeHouseholds) {
                // 2. Simulate realistic metrics for this specific household
                const powerConsumedKW = Math.round((Math.random() * (3.2 - 0.8) + 0.8) * 100) / 100
                const powerConsumedKWh = Math.round((powerConsumedKW / 60) * 1000) / 1000 // 1-minute fraction
                const gridVoltage = Math.floor(Math.random() * (242 - 220 + 1) + 220)
                const batteryLevelPercent = Math.floor(Math.random() * (95 - 40 + 1) + 40)
                const solarGeneratedKW = Math.round((Math.random() * (2.5 - 0.5) + 0.5) * 100) / 100

                // 3. Mock Express req, res, and next objects to pass into your controller
                const mockReq = {
                    body: {
                        householdId: household._id.toString(),
                        powerConsumedKWh: powerConsumedKWh,
                        powerConsumedKW: powerConsumedKW,
                        batteryLevelPercent: batteryLevelPercent,
                        solarGeneratedKW: solarGeneratedKW,
                        gridVoltage: gridVoltage
                    }
                } as any

                // A mock response object that captures what the controller returns
                const mockRes = {
                    status: function (code: number) {
                        this.statusCode = code
                        return this
                    },
                    json: function (data: any) {
                        return data
                    }
                } as any

                const mockNext = (err: any) => {
                    if (err) console.error(`[CRON ERROR in telemetry loop for ${household._id}]:`, err)
                }

                // 4. Trigger your exact controller logic natively!
                await recordTelemetry(mockReq, mockRes, mockNext)
            }

            console.log('[CRON] Telemetry simulation batch completed successfully.')
        } catch (error) {
            console.error('[CRON ERROR] Failed in telemetry cron loop:', error)
        }
    })
}