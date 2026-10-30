import 'dotenv/config'
import axios from 'axios'
import Environment from '../models/environment.model'

// Coordinates for Ibadan, Nigeria: 7.3775° N, 3.9470° E
const ESTATE_LATITUDE = process.env.ESTATE_LAT || '7.3775'
const ESTATE_LONGITUDE = process.env.ESTATE_LNG || '3.9470'

const SYSTEM_CAPACITY_KW = Number.parseFloat(process.env.SOLAR_CAPACITY_KW || '250')

export const fetchAndSaveEnvironmentMetrics = async (): Promise<void> => {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${ESTATE_LATITUDE}&longitude=${ESTATE_LONGITUDE}&current=temperature_2m,cloud_cover,direct_normal_irradiance,global_tilted_irradiance`

        const response = await axios.get(url)
        const currentData = response.data?.current

        if (!currentData) {
            throw new Error('Invalid response structure from weather provider')
        }

        const temperatureC = currentData.temperature_2m || 25
        const cloudCoverPercent = currentData.cloud_cover || 0
        
        // Use global irradiance or fallback to direct normal irradiance
        const solarIrradiance = currentData.global_tilted_irradiance ?? currentData.direct_normal_irradiance ?? 0

        // Calculate expected solar output in kW
        // Standard Test Conditions (STC): 1000 W/m² at 25°C
        const tempCoeff = 1 - Math.max(0, temperatureC - 25) * 0.004
        const rawYieldKW = SYSTEM_CAPACITY_KW * (solarIrradiance / 1000) * tempCoeff
        const expectedYieldKW = Math.max(0, Math.round(rawYieldKW * 100) / 100)

        // Save environmental snapshot
        await Environment.create({
            cloudCoverPercent,
            temperatureC,
            solarIrradiance,
            expectedYieldKW,
            timestamp: new Date()
        })

        console.log(`[WEATHER CRON] Recorded: Irradiance=${solarIrradiance} W/m², Temp=${temperatureC}°C, ExpectedYield=${expectedYieldKW} kW`)
    } catch (error) {
        console.error('[WEATHER SERVICE ERROR] Failed to fetch weather metrics:', error)
    }
}