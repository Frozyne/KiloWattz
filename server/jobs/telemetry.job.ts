// server/src/jobs/telemetry.job.ts
import { CronJob } from 'cron'
import { Server } from 'socket.io'
import Household, { type IMeter, type ITerminal } from '../models/household.model.js'
import Telemetry from '../models/telemetry.model.js'
import { checkHouseholdUsageSpike } from '../services/spike.service.js'
import { calculateCentralSolarGeneration } from '../services/solar.service.js'
import { updateCentralBatteryLevel } from '../services/battery.service.js'
import Enviroment from '../models/environment.model.js'

const terminalKeys: (keyof IMeter)[] = [
    'terminal1',
    'terminal2',
    'terminal3',
    'terminal4',
    'terminal5',
    'terminal6',
]

const INTERVAL_HOURS = 3 / 60 // 0.05 hours per 3-minute cron tick

function getTimeOfDayMultiplier(): number {
    const hour = new Date().getHours()
    if (hour >= 18 && hour <= 22) return 1.35 // Evening peak
    if (hour >= 6 && hour <= 9) return 1.15   // Morning peak
    if (hour >= 0 && hour <= 5) return 0.65   // Overnight baseline
    return 1.0
}

export const createTelemetryCron = (io: Server) => {
    return new CronJob(
        '*/3 * * * *',
        async () => {
            try {
                const activeHouseholds = await Household.find({ connectionStatus: 'Active' })
                const latestEnvironment = await Enviroment.findOne().sort({ timestamp: -1 })

                const { totalGeneratedKW } = await calculateCentralSolarGeneration(
                    latestEnvironment?.solarIrradiance,
                    latestEnvironment?.cloudCoverPercent,
                    latestEnvironment?.temperatureC
                )

                const loadMultiplier = getTimeOfDayMultiplier()
                let totalEstateLoadKW = 0

                const snapshots: Array<{
                    household: typeof activeHouseholds[number]
                    currentPowerKW: number
                    finalIntervalKWh: number
                    updatedTerminals: Record<string, number>
                    hasBreached: boolean
                }> = []

                // 1. Calculate actual load per household from its 'On' terminals
                for (const household of activeHouseholds) {
                    let currentPowerKW = 0
                    const updatedTerminals: Record<string, number> = {}

                    for (const key of terminalKeys) {
                        const terminal: ITerminal = household.meter[key]
                        if (!terminal) continue

                        // Live wattage/kW reading for this terminal (0 when Off/Fault)
                        const terminalKW = terminal.connectionStatus === 'On'
                            ? Math.round((Math.random() * (0.55 - 0.10) + 0.10) * loadMultiplier * 100) / 100
                            : 0

                        // Save the live kW reading directly onto the terminal document
                        updatedTerminals[`meter.${key}.consumedKW`] = terminalKW
                        currentPowerKW += terminalKW
                    }

                    currentPowerKW = Math.round(currentPowerKW * 100) / 100
                    const finalIntervalKWh = Math.round(currentPowerKW * INTERVAL_HOURS * 1000) / 1000
                    totalEstateLoadKW += currentPowerKW

                    const previousDailyKWh = household.consumedKWh || 0
                    const newDailyKWh = Math.round((previousDailyKWh + finalIntervalKWh) * 100) / 100

                    const quota = household.dailyKWHQuota || 15
                    const hasBreached = quota > 0 && previousDailyKWh < quota && newDailyKWh >= quota
                    const householdName = `Plot ${household.plotNumber}, ${household.street}`

                    await checkHouseholdUsageSpike(household._id.toString(), householdName, currentPowerKW, io)

                    snapshots.push({
                        household,
                        currentPowerKW,
                        finalIntervalKWh,
                        updatedTerminals,
                        hasBreached,
                    })
                }

                // 2. Update central battery SoC from Solar Generation vs. Total Estate Load
                const batteryState = await updateCentralBatteryLevel({
                    solarGeneratedKW: totalGeneratedKW,
                    totalEstateLoadKW,
                    intervalHours: INTERVAL_HOURS,
                })

                // 3. Persist household updates & telemetry logs
                const householdOps: any[] = []
                const telemetryLogs: any[] = []

                for (const snap of snapshots) {
                    const { household, currentPowerKW, finalIntervalKWh, updatedTerminals, hasBreached } = snap

                    // Realistic slight voltage sag proportional to estate & household load (~234V nominal)
                    const voltageSag = totalEstateLoadKW * 0.12 + currentPowerKW * 0.8
                    const gridVoltage = Math.round((235 - voltageSag + (Math.random() * 1.4 - 0.7)) * 10) / 10

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
                        household: household._id,
                        powerConsumedKWh: finalIntervalKWh,
                        powerConsumedKW: currentPowerKW,
                        batteryLevelPercent: batteryState.batteryLevelPercent,
                        solarGeneratedKW: totalGeneratedKW,
                        gridVoltage,
                        timestamp: new Date(),
                    })
                }

                if (householdOps.length > 0) {
                    await Promise.all([
                        Household.bulkWrite(householdOps),
                        Telemetry.insertMany(telemetryLogs),
                    ])
                }

                console.log(
                    `[CRON] Solar: ${totalGeneratedKW} kW | Load: ${Math.round(totalEstateLoadKW * 100) / 100} kW | Battery: ${batteryState.batteryLevelPercent}% (${batteryState.status})`
                )

                io.emit('telemetry:new', {
                    timestamp: new Date(),
                    updatedCount: activeHouseholds.length,
                    batteryLevelPercent: batteryState.batteryLevelPercent,
                    batteryStatus: batteryState.status,
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