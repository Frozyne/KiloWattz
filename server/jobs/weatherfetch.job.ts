import cron from 'node-cron'
import { fetchAndSaveEnvironmentMetrics } from '../services/weather.service'


// Scheduled cron job to fetch weather data every hour on the hour.

export const initWeatherCronJob = (): void => {

    // Cron schedule: '*/5 * * * *' = Every 5 minutes
    cron.schedule('*/5 * * * *', async () => {
        console.log('[CRON] Fetching hourly environmental metrics...')
        await fetchAndSaveEnvironmentMetrics()
    })
}