import cron from 'node-cron'
import Telemetry from '../models/telemetry.model'
import Household from '../models/household.model'
import Infrastructure from '../models/infrastructure.model'
import DailyReport from '../models/dailyreport.model'

export const initDailyReportJob = (): void => {
    cron.schedule(
        '59 23 * * *',
        async () => {
            console.log('[CRON 23:59] Generating daily estate performance snapshot...')

            try {
                const startOfDay = new Date()
                startOfDay.setHours(0, 0, 0, 0)

                // 1. Aggregate total energy consumed and peak power demand across all household telemetry today
                const householdStats = await Telemetry.aggregate([
                    {
                        $match: {
                            scope: 'Household',
                            timestamp: { $gte: startOfDay }
                        }
                    },
                    {
                        $group: {
                            _id: '$household',
                            minReading: { $min: '$powerConsumedKWh' },
                            maxReading: { $max: '$powerConsumedKWh' },
                            peakKW: { $max: '$powerConsumedKW' }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            totalConsumedKWh: { $sum: { $subtract: ['$maxReading', '$minReading'] } },
                            maxPeakPowerKW: { $max: '$peakKW' }
                        }
                    }
                ])

                // 2. Calculate count of quota breaches logged today across all households
                const breachAgg = await Household.aggregate([
                    { $unwind: '$quotaBreaches' },
                    { $match: { 'quotaBreaches.breachedAt': { $gte: startOfDay } } },
                    { $count: 'totalBreaches' }
                ])

                // 3. Compute average Battery Bank State of Charge (SoC) across infrastructure
                const batteries = await Infrastructure.find({ type: 'BatteryBank' })
                const avgSoC = batteries.length > 0
                    ? batteries.reduce((acc, b) => acc + (b.diagnostics?.stateOfChargePercent || 0), 0) / batteries.length
                    : 0

                // 4. Save daily report snapshot
                await DailyReport.create({
                    date: startOfDay,
                    totalEnergyConsumedKWh: Math.round((householdStats[0]?.totalConsumedKWh || 0) * 100) / 100,
                    peakPowerDemandKW: Math.round((householdStats[0]?.maxPeakPowerKW || 0) * 100) / 100,
                    totalQuotaBreaches: breachAgg[0]?.totalBreaches || 0,
                    averageBatterySoCPercent: Math.round(avgSoC * 10) / 10
                })

                console.log('[CRON 23:59] Daily estate performance snapshot saved.')
            } catch (error) {
                console.error('[CRON ERROR] Failed to generate daily estate report:', error)
            }
        },
        { timezone: 'Africa/Lagos' }
    )
}