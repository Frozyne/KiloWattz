// server/src/services/battery.service.ts
import Infrastructure from '../models/infrastructure.model.js'

interface BatteryUpdateInput {
    solarGeneratedKW: number
    totalEstateLoadKW: number
    intervalHours: number // 3 mins = 0.05 hrs
}

export interface BatterySimulationResult {
    batteryLevelPercent: number
    netPowerKW: number
    status: 'Charging' | 'Discharging' | 'Idle'
}

const CHARGE_EFFICIENCY = 0.95
const DISCHARGE_EFFICIENCY = 0.95
const MIN_SOC_PERCENT = 5

export const updateCentralBatteryLevel = async ({
    solarGeneratedKW,
    totalEstateLoadKW,
    intervalHours,
}: BatteryUpdateInput): Promise<BatterySimulationResult> => {
    const batteryBanks = await Infrastructure.find({
        type: 'BatteryBank',
        status: { $nin: ['Offline', 'UnderMaintenance'] },
    })

    const netPowerKW = Math.round((solarGeneratedKW - totalEstateLoadKW) * 100) / 100

    if (!batteryBanks.length) {
        return { batteryLevelPercent: 0, netPowerKW, status: 'Idle' }
    }

    // Effective usable kWh across online banks (scaled by capacity and health)
    let effectiveCapacityKWh = 0
    let currentStoredKWh = 0

    for (const bank of batteryBanks) {
        const ratedCap = bank.capacityKWh ?? bank.capacityKW ?? 250
        const health = (bank.healthPercent ?? 100) / 100
        const usableCap = ratedCap * health
        const soc = bank.diagnostics?.stateOfChargePercent ?? 75

        effectiveCapacityKWh += usableCap
        currentStoredKWh += usableCap * (soc / 100)
    }

    if (effectiveCapacityKWh <= 0) {
        return { batteryLevelPercent: 0, netPowerKW, status: 'Idle' }
    }

    // Convert net kW over the 3-minute interval into kWh delta
    const deltaKWh = netPowerKW >= 0
        ? netPowerKW * intervalHours * CHARGE_EFFICIENCY
        : (netPowerKW * intervalHours) / DISCHARGE_EFFICIENCY

    const minEnergyKWh = effectiveCapacityKWh * (MIN_SOC_PERCENT / 100)
    const nextStoredKWh = Math.min(effectiveCapacityKWh, Math.max(minEnergyKWh, currentStoredKWh + deltaKWh))
    const nextSoC = Math.round((nextStoredKWh / effectiveCapacityKWh) * 1000) / 10

    await Infrastructure.bulkWrite(
        batteryBanks.map((bank) => ({
            updateOne: {
                filter: { _id: bank._id },
                update: {
                    $set: {
                        'diagnostics.stateOfChargePercent': nextSoC,
                    },
                },
            },
        }))
    )

    return {
        batteryLevelPercent: nextSoC,
        netPowerKW,
        status: netPowerKW > 0.05 ? 'Charging' : netPowerKW < -0.05 ? 'Discharging' : 'Idle',
    }
}