import Household from '../models/household.model.js'
import Telemetry from '../models/telemetry.model.js'
import Alert from '../models/alert.model.js'
import { CronJob } from 'cron'

export const initMeterHeartbeatJob = new CronJob('*/10 * * * *', async () => {
        try {
            const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000)
            
            // Find households whose latest telemetry is older than 30 minutes
            const activeHouseholds = await Household.find({ connectionStatus: { $ne: 'Disconnected' } }).select('_id plotNumber street meterSerialNumber')

            for (const household of activeHouseholds) {
                const recentPing = await Telemetry.findOne({
                    household: household._id,
                    timestamp: { $gte: thirtyMinutesAgo }
                }).exec()

                if (!recentPing) {
                    // Avoid creating duplicate unresolved warning alerts
                    const existingAlert = await Alert.findOne({
                        household: household._id,
                        title: 'Meter Offline Warning',
                        isResolved: false
                    })

                    if (!existingAlert) {
                        await Alert.create({
                            title: 'Meter Offline Warning',
                            message: `Smart meter (${household.meterSerialNumber || 'N/A'}) at Plot ${household.plotNumber}, ${household.street} has stopped sending telemetry logs for over 30 minutes.`,
                            severity: 'Warning',
                            scope: 'Household',
                            household: household._id
                        })
                    }
                }
            }
        } catch (error) {
            console.error('[CRON ERROR] Meter heartbeat scan failed:', error)
        }
    },
    null,
    false,
    'Africa/Lagos'
)