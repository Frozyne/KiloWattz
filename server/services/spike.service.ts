import Alert from '../models/alert.model'
import { Server } from 'socket.io'

/**
 * Checks for sudden power draw spikes and creates a mild warning alert.
 * Uses a 15-minute sliding window to prevent duplicate alert spam.
 */
export const checkHouseholdUsageSpike = async (
    householdId: string,
    householdName: string,
    currentPowerKW: number,
    io?: Server,
    spikeThresholdKW: number = 2.8
): Promise<void> => {
    if (currentPowerKW < spikeThresholdKW) return

    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000)

    // Check if an unresolved or recent spike alert exists for this household
    const existingAlert = await Alert.findOne({
        household: householdId,
        title: 'MILD: Sudden Usage Spike',
        createdAt: { $gte: fifteenMinutesAgo },
    })

    if (!existingAlert) {
        const newAlert = await Alert.create({
            title: 'MILD: Sudden Usage Spike',
            message: `${householdName} registered a sudden power surge of ${currentPowerKW} kW.`,
            severity: 'Warning',
            scope: 'Household',
            household: householdId,
            isResolved: false,
        })

        if (io) {
            io.emit('alert:new', newAlert)
        }

        console.warn(`[SPIKE DETECTED] ${householdName} drew ${currentPowerKW} kW (Threshold: ${spikeThresholdKW} kW).`)
    }
}