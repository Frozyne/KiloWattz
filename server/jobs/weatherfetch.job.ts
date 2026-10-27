import cron from 'node-cron'
import { fetchAndSaveEnvironmentMetrics } from '../services/weather.service'


// Scheduled cron job to fetch weather data every hour on the hour.

export const initWeatherCronJob = (): void => {

    // Cron schedule: '0 * * * *' = At minute 0 of every hour
    cron.schedule('0 * * * *', async () => {
        console.log('[CRON] Fetching hourly environmental metrics...')
        await fetchAndSaveEnvironmentMetrics()
    })
}