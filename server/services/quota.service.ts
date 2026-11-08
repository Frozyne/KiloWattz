import Household from '../models/household.model'
import Infrastructure from '../models/infrastructure.model'

export const recalculateAllHouseholdQuotas = async (): Promise<number> => {
    try {
        const solarAssets = await Infrastructure.find({ type: 'SolarArray', status: 'Operational' })
        let totalSolarKW = solarAssets.reduce((sum, asset) => sum + (asset.capacityKW || 0), 0)

        if (totalSolarKW === 0) {
            totalSolarKW = Number.parseFloat(process.env.SOLAR_CAPACITY_KW || '250')
        }

        const PEAK_SUN_HOURS = 5
        const SYSTEM_EFFICIENCY = 0.85
        const totalDailyGridKWh = totalSolarKW * PEAK_SUN_HOURS * SYSTEM_EFFICIENCY

        // Count connected/active households (excludes 'Disconnected' status)
        const connectedHouseholdCount = await Household.countDocuments({
            connectionStatus: { $ne: 'Disconnected' },
        })

        // Edge case: If 0 households are connected, reset all quotas to 0
        if (connectedHouseholdCount === 0) {
            await Household.updateMany({}, { $set: { dailyKWHQuota: 0 } })
            console.log('[QUOTA ENGINE] 0 connected households. Quotas set to 0.')
            return 0
        }

        const autoQuotaKWh = Math.floor((totalDailyGridKWh / connectedHouseholdCount) * 100) / 100

        await Household.updateMany(
            { connectionStatus: { $ne: 'Disconnected' } },
            { $set: { dailyKWHQuota: autoQuotaKWh } }
        )

        // Set quota to 0 explicitly for any disconnected households
        await Household.updateMany(
            { connectionStatus: 'Disconnected' },
            { $set: { dailyKWHQuota: 0 } }
        )

        console.log(
            `[QUOTA ENGINE] Auto-recalculated: ${autoQuotaKWh} kWh/day per household across ${connectedHouseholdCount} connected households.`
        )

        return autoQuotaKWh
    } catch (error) {
        console.error('[QUOTA ENGINE ERROR] Failed to recalculate quotas:', error)
        throw error
    }
}