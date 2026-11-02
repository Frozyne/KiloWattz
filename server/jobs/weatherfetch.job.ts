import cron from 'node-cron'
import { fetchAndSaveEnvironmentMetrics } from '../services/weather.service'


// Scheduled cron job to fetch weather data every hour on the hour.

export const initWeatherCronJob = (): void => {

    // Cron schedule: Every 1 minute
    cron.schedule('* * * * *', async () => {
        console.log('[CRON] Fetching hourly environmental metrics...')
        await fetchAndSaveEnvironmentMetrics()
    })
}