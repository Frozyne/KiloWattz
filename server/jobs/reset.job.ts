import cron from 'node-cron'
import Household from '../models/household.model'

export const initQuotaResetJob = (): void => {
    cron.schedule(
        '0 0 * * *',
        async () => {
            console.log('[CRON 00:00] Starting midnight daily quota & transfer reset...')

            try {
                // 1. Reactivate all suspended households
                const householdResult = await Household.updateMany(
                    { connectionStatus: 'Suspended'},
                    { $set: { connectionStatus: 'Active' } }
                )

                console.log(
                    `[CRON 00:00] Midnight reset completed successfully. ` +
                    `Reactivated: ${householdResult.modifiedCount} households. `
                )
            } catch (error) {
                console.error('[CRON ERROR] Failed to execute midnight quota reset:', error)
            }
        },
        { timezone: 'Africa/Lagos' }
    )
}