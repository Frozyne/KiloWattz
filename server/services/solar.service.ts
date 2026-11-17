// server/src/services/solar.service.ts
import Infrastructure from '../models/infrastructure.model.js'

export interface SolarGenerationResult {
    totalGeneratedKW: number
    activeArrayCount: number
}

export const calculateCentralSolarGeneration = async (
    solarIrradianceWm2: number = 800,
    cloudCoverPercent: number = 20,
    temperatureC: number = 25
): Promise<SolarGenerationResult> => {
    const solarArrays = await Infrastructure.find({ type: 'SolarArray' })
    if (!solarArrays.length) {
        return { totalGeneratedKW: 0, activeArrayCount: 0 }
    }

    const currentHour = new Date().getHours()
    const isDaytime = currentHour >= 6 && currentHour <= 18

    // Zero out all array live outputs at night so UI diagnostics don't stay stuck on sunset values
    if (!isDaytime || solarIrradianceWm2 <= 0) {
        await Infrastructure.updateMany(
            { type: 'SolarArray' },
            { $set: { 'diagnostics.currentOutputKW': 0 } }
        )
        return { totalGeneratedKW: 0, activeArrayCount: 0 }
    }

    const timeFactor = Math.sin(((currentHour - 6) / 12) * Math.PI)
    const cloudReduction = 1 - (Math.min(100, Math.max(0, cloudCoverPercent)) / 100) * 0.75
    const weatherFactor = Math.min(solarIrradianceWm2 / 1000, 1.0) * cloudReduction

    // Thermal derating: -0.4% efficiency per °C above 25°C STC
    const thermalFactor = temperatureC > 25
        ? Math.max(0.7, 1 - (temperatureC - 25) * 0.004)
        : 1

    let totalGeneratedKW = 0
    let activeArrayCount = 0
    const bulkOps: any[] = []

    for (const array of solarArrays) {
        if (array.status === 'Offline' || array.status === 'UnderMaintenance') {
            bulkOps.push({
                updateOne: {
                    filter: { _id: array._id },
                    update: { $set: { 'diagnostics.currentOutputKW': 0 } },
                },
            })
            continue
        }

        activeArrayCount++

        const capacity = array.capacityKW ?? 25
        const healthFactor = (array.healthPercent ?? 100) / 100
        const efficiencyFactor = (array.diagnostics?.efficiencyPercent ?? 85) / 100

        const arrayOutputKW =
            capacity * timeFactor * weatherFactor * thermalFactor * efficiencyFactor * healthFactor
        const finalArrayKW = Math.max(0, Math.round(arrayOutputKW * 100) / 100)

        totalGeneratedKW += finalArrayKW

        bulkOps.push({
            updateOne: {
                filter: { _id: array._id },
                update: { $set: { 'diagnostics.currentOutputKW': finalArrayKW } },
            },
        })
    }

    if (bulkOps.length > 0) {
        await Infrastructure.bulkWrite(bulkOps)
    }

    return {
        totalGeneratedKW: Math.round(totalGeneratedKW * 100) / 100,
        activeArrayCount,
    }
}