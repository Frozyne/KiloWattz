import Infrastructure from '../models/infrastructure.model.js'

export interface SolarGenerationResult {
    totalGeneratedKW: number
    activeArrayCount: number
}

export const calculateCentralSolarGeneration = async (
    solarIrradianceWm2: number = 800,
    cloudCoverPercent: number = 20
): Promise<SolarGenerationResult> => {
    const currentHour = new Date().getHours()
    const isDaytime = currentHour >= 6 && currentHour <= 18

    if (!isDaytime) {
        return { totalGeneratedKW: 0, activeArrayCount: 0 }
    }

    // 1. Fetch all SolarArray assets from DB
    const solarArrays = await Infrastructure.find({ type: 'SolarArray' })

    if (!solarArrays.length) {
        return { totalGeneratedKW: 0, activeArrayCount: 0 }
    }

    // 2. Compute solar irradiance & daytime curves
    const timeFactor = Math.sin(((currentHour - 6) / 12) * Math.PI)
    const cloudReduction = 1 - (cloudCoverPercent / 100) * 0.75
    const weatherFactor = Math.min(solarIrradianceWm2 / 1000, 1.0) * cloudReduction

    let totalGeneratedKW = 0
    let activeArrayCount = 0

    // 3. Dynamic iteration using document fields
    for (const array of solarArrays) {
        // Zero output if array is currently offline or under maintenance
        if (array.status === 'Offline' || array.status === 'UnderMaintenance') {
            if (array.diagnostics) array.diagnostics.currentOutputKW = 0
            await array.save()
            continue
        }

        activeArrayCount++

        const capacity = array.capacityKW ?? 25
        const healthFactor = (array.healthPercent ?? 100) / 100
        const efficiencyFactor = (array.diagnostics?.efficiencyPercent ?? 85) / 100

        // Calculate output scaled by array capacity, efficiency, health, and solar conditions
        const arrayOutputKW = capacity * timeFactor * weatherFactor * efficiencyFactor * healthFactor
        const finalArrayKW = Math.max(0, Math.round(arrayOutputKW * 100) / 100)

        totalGeneratedKW += finalArrayKW

        // Sync live output back to individual array diagnostics for UI monitoring
        if (!array.diagnostics) array.diagnostics = {}
        array.diagnostics.currentOutputKW = finalArrayKW
        await array.save()
    }

    return {
        totalGeneratedKW: Math.round(totalGeneratedKW * 100) / 100,
        activeArrayCount,
    }
}