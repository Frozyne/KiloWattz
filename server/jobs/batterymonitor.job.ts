import cron from 'node-cron'
import Infrastructure from '../models/infrastructure.model'
import Alert from '../models/alert.model'
import Household from '../models/household.model'

export const initBatteryGuardJob = (): void => {
    cron.schedule('*/15 * * * *', async () => {
        try {
            const batteryBanks = await Infrastructure.find({ type: 'BatteryBank', status: 'Operational' })

            for (const battery of batteryBanks) {
                const soc = battery.diagnostics?.stateOfChargePercent ?? 100

                // Level 1: Warning/Critical Alert (SoC < 20%)
                if (soc < 20 && soc >= 10) {
                    const existingAlert = await Alert.findOne({
                        infrastructure: battery._id,
                        title: 'CRITICAL: Low Battery Reserve',
                        isResolved: false
                    })

                    if (!existingAlert) {
                        await Alert.create({
                            title: 'CRITICAL: Low Battery Reserve',
                            message: `${battery.name} State of Charge has dropped to ${soc}%. Prepare generator back-up or load reduction.`,
                            severity: 'Critical',
                            scope: 'Infrastructure',
                            infrastructure: battery._id
                        })
                    }
                } 
                // Level 2: Automated Partial Load-Shedding Trigger (SoC < 10%)
                else if (soc < 10) {
                    // Suspend high-consumption or active connections to protect battery chemistry from deep discharge
                    const suspendResult = await Household.updateMany(
                        { connectionStatus: 'Active' },
                        { $set: { connectionStatus: 'Suspended' } }
                    )

                    await Alert.create({
                        title: 'EMERGENCY: Automated Battery Protection Shedding Activated',
                        message: `${battery.name} reached unsafe depth of discharge (${soc}%). Automated shedding suspended ${suspendResult.modifiedCount} households.`,
                        severity: 'Emergency',
                        scope: 'System',
                        infrastructure: battery._id
                    })
                }
            }
        } catch (error) {
            console.error('[CRON ERROR] Battery guard scanner failed:', error)
        }
    })
}