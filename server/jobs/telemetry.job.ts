import { CronJob } from 'cron'
import { Server } from 'socket.io'
import Household, { type IMeter, type ITerminal } from '../models/household.model'
import Telemetry from '../models/telemetry.model'
import { checkHouseholdUsageSpike } from '../services/spike.service'
import { calculateCentralSolarGeneration } from '../services/solar.service'
import Enviroment from '../models/environment.model'

const terminalKeys: (keyof IMeter)[] = [
    'terminal1',
    'terminal2',
    'terminal3',
    'terminal4',
    'terminal5',
    'terminal6',
]

export const createTelemetryCron = (io: Server) => {
    return new CronJob(
        '*/3 * * * *',
        async () => {
            try {
                const activeHouseholds = await Household.find({ connectionStatus: 'Active' })
                if (!activeHouseholds.length) return

                const householdOps: any[] = []
                const telemetryLogs: any[] = []

                const latestEnvironment = await Enviroment.findOne().sort({ timestamp: -1 })

                const { totalGeneratedKW } = await calculateCentralSolarGeneration(
                    latestEnvironment?.solarIrradiance,
                    latestEnvironment?.cloudCoverPercent
                )

                for (const household of activeHouseholds) {
                    let calculatedHouseholdKWh = 0
                    const updatedTerminals: Record<string, number> = {}

                    for (const key of terminalKeys) {
                        const terminal: ITerminal = household.meter[key]
                        if (!terminal) continue

                        const draw = terminal.connectionStatus === 'On'
                            ? Math.round((Math.random() * (0.20 - 0.02) + 0.02) * 100) / 100
                            : 0
                        updatedTerminals[`meter.${key}.consumedKWh`] = draw
                        calculatedHouseholdKWh += draw
                    }

                    const finalIntervalKWh = Math.round(calculatedHouseholdKWh * 100) / 100
                    const currentPowerKW = Math.round((Math.random() * (3.2 - 0.8) + 0.8) * 100) / 100
                    const previousDailyKWh = household.consumedKWh || 0
                    const newDailyKWh = Math.round((previousDailyKWh + finalIntervalKWh) * 100) / 100
                    
                    // Daily quota is automatically calculated by the system
                    const quota = household.dailyKWHQuota || 15
                    const hasBreached = quota > 0 && previousDailyKWh < quota && newDailyKWh >= quota
                    const householdName = `Plot ${household.plotNumber}, ${household.street}`

                    // Check for power spike (Minor Change)
                    await checkHouseholdUsageSpike(household._id.toString(), householdName, currentPowerKW, io)

                    householdOps.push({
                        updateOne: {
                            filter: { _id: household._id },
                            update: {
                                $set: {
                                    ...updatedTerminals,
                                    ...(hasBreached ? { connectionStatus: 'Suspended' } : {}),
                                },
                                $inc: { consumedKWh: finalIntervalKWh },
                            },
                        },
                    })

                    telemetryLogs.push({
                        householdId: household._id,
                        powerConsumedKWh: finalIntervalKWh,
                        powerConsumedKW: currentPowerKW,
                        batteryLevelPercent: Math.floor(Math.random() * (95 - 40 + 1) + 40),
                        solarGeneratedKW: totalGeneratedKW,
                        gridVoltage: Math.floor(Math.random() * (242 - 220 + 1) + 220),
                        timestamp: new Date(),
                    })
                }

                await Promise.all([
                    Household.bulkWrite(householdOps),
                    Telemetry.insertMany(telemetryLogs),
                ])

                console.log('[CRON] Telemetry execution completed')

                io.emit('telemetry:new', {
                    timestamp: new Date(),
                    updatedCount: activeHouseholds.length,
                })
            } catch (error) {
                console.error('[CRON ERROR] Telemetry execution failed:', error)
            }
        },
        null,
        false,
        'Africa/Lagos'
    )
}