import { CronJob } from 'cron'
import { Server } from 'socket.io'
import Household, { type IMeter, type ITerminal } from '../models/household.model'
import Telemetry from '../models/telemetry.model'

export interface QuotaBreachPayload {
    householdId: string
    householdName: string
    dailyKWHQuota: number
    consumedKWh: number
    timestamp: Date
}

const terminalKeys: (keyof IMeter)[] = [
    'terminal1',
    'terminal2',
    'terminal3',
    'terminal4',
    'terminal5',
    'terminal6',
]

type ActiveHousehold = Awaited<ReturnType<typeof Household.find>>[number]

const processHousehold = (household: ActiveHousehold) => {
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
    const previousDailyKWh = household.consumedKWh || 0
    const newDailyKWh = Math.round((previousDailyKWh + finalIntervalKWh) * 100) / 100
    const quota = household.dailyKWHQuota
    const hasBreachedThisTick = quota > 0 && previousDailyKWh < quota && newDailyKWh >= quota
    const householdName = `${household.plotNumber}, ${household.street}`

    return {
        householdOp: {
            updateOne: {
                filter: { _id: household._id },
                update: {
                    $set: {
                        ...updatedTerminals,
                        ...(hasBreachedThisTick ? { connectionStatus: 'Suspended' } : {}),
                    },
                    $inc: { consumedKWh: finalIntervalKWh },
                },
            },
        },
        telemetryLog: {
            householdId: household._id,
            householdName,
            powerConsumedKWh: finalIntervalKWh,
            powerConsumedKW: Math.round((Math.random() * (3.2 - 0.8) + 0.8) * 100) / 100,
            batteryLevelPercent: Math.floor(Math.random() * (95 - 40 + 1) + 40),
            solarGeneratedKW: Math.round((Math.random() * (2.5 - 0.5) + 0.5) * 100) / 100,
            gridVoltage: Math.floor(Math.random() * (242 - 220 + 1) + 220),
            timestamp: new Date(),
        },
        quotaBreach: hasBreachedThisTick ? {
            householdId: household._id.toString(),
            householdName,
            dailyKWHQuota: quota,
            consumedKWh: newDailyKWh,
            timestamp: new Date(),
        } : undefined,
    }
}

export const createTelemetryCron = (io: Server) => {
    return new CronJob(
        '*/1 * * * *',
        async () => {
            try {
                const activeHouseholds = await Household.find({ connectionStatus: 'Active' })
                
                if (!activeHouseholds.length) {
                    console.log('[CRON TELEMETRY] Skipped: No active households found.')
                    return
                }

                const results = activeHouseholds.map(processHousehold)
                await Promise.all([
                    Household.bulkWrite(results.map(({ householdOp }) => householdOp)),
                    Telemetry.insertMany(results.map(({ telemetryLog }) => telemetryLog)),
                ])

                io.emit('telemetry:new', {
                    timestamp: new Date(),
                    updatedCount: activeHouseholds.length,
                })

                const breaches = results.flatMap(({ quotaBreach }) => (quotaBreach ? [quotaBreach] : []))
                for (const breach of breaches) {
                    console.warn(`[QUOTA BREACH] Household ${breach.householdName} exceeded daily limit (${breach.consumedKWh}/${breach.dailyKWHQuota} kWh)`)
                    io.emit('household:quota_breached', breach)
                }
            } catch (error) {
                console.error('[CRON ERROR] Telemetry execution failed:', error)
            }
        },
        null,
        false, // Set start to false
        'Africa/Lagos'
    )
}