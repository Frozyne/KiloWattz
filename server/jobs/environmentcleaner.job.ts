import cron from 'node-cron'
import Environment from '../models/environment.model'

export const startEnvironmentCleanupCron = () => {
    // Runs every 30 minutes to purge old weather records
    cron.schedule('*/30 * * * *', async () => {
        try {
            // Calculate the threshold timestamp (1 hour ago)
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)

            // Delete records older than 1 hour
            const result = await Environment.deleteMany({
                timestamp: { $lt: oneHourAgo }
            })

            if (result.deletedCount && result.deletedCount > 0) {
                console.log(`[CRON] Cleaned up ${result.deletedCount} outdated environment logs.`)
            }
        } catch (error) {
            console.error('[CRON ERROR] Failed to clean up environment data:', error)
        }
    })
}