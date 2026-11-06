
import cron from 'node-cron'
import { fetchAndSaveEnvironmentMetrics } from '../services/weather.service'

export const initWeatherCronJob = (): void => {
    // Run every hour on the hour
    cron.schedule('0 * * * *', async () => {
        console.log('[CRON] Fetching hourly environmental metrics...')

        try {
            await fetchAndSaveEnvironmentMetrics()
        } catch (error) {
            console.error('[WEATHER CRON ERROR]', error)
        }
    })
}
