import { CronJob } from 'cron'
import Telemetry from '../models/telemetry.model.js'

export const initTelemetryArchiveJob = new CronJob('0 2 * * *', async () => {
        console.log('[CRON 02:00] Starting telemetry storage cleanup...')

        try {
            // Delete raw telemetry pings older than 90 days to keep query indexes lightweight
            const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)

            const deleteResult = await Telemetry.deleteMany({
                timestamp: { $lt: ninetyDaysAgo }
            })

            console.log(`[CRON 02:00] Telemetry cleanup finished. Pruned ${deleteResult.deletedCount} old telemetry entries.`)
        } catch (error) {
            console.error('[CRON ERROR] Telemetry archive job failed:', error)
        }
    },
    null,
    false,
    'Africa/Lagos'
)