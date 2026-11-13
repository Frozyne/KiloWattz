import { CronJob } from 'cron'
import { Server } from 'socket.io'
import { fetchAndSaveEnvironmentMetrics } from '../services/weather.service.js'

export const createWeatherCronJob = (io: Server) => {
    return new CronJob(
        '*/1 * * * *',
        async () => {
            console.log('[CRON] Fetching hourly environmental metrics...')
            try {
                await fetchAndSaveEnvironmentMetrics(io)
            } catch (error) {
                console.error('[WEATHER CRON ERROR]', error)
            }
        },
        null,
        false,
        'Africa/Lagos'
    )
}