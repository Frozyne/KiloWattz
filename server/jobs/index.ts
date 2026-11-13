import { Server } from 'socket.io'
import { initQuotaResetJob } from './reset.job.js'
import { initDailyReportJob } from './dailyreport.job.js'
import { initMeterHeartbeatJob } from './metermonitor.job.js'
import { initBatteryGuardJob } from './batterymonitor.job.js'
import { initTelemetryArchiveJob } from './archivecleaner.job.js'
import { createWeatherCronJob } from './weatherfetch.job.js'
import { createInfrastructureSimulatorCron } from './infrastructuresimulator.job.js'
import { startEnvironmentCleanupCron } from './environmentcleaner.job.js'
import { createTelemetryCron } from './telemetry.job.js'

export const startAllCronJobs = (io: Server): void => {
    console.log('Initializing Microgrid Background Task Schedulers...')

    initQuotaResetJob.start()
    initDailyReportJob.start()
    initMeterHeartbeatJob.start()
    initBatteryGuardJob.start()
    initTelemetryArchiveJob.start()
    startEnvironmentCleanupCron.start()

    // Instantiate and start jobs that depend on Socket.IO
    const weatherJob = createWeatherCronJob(io)
    const telemetryJob = createTelemetryCron(io)
    const infrastructureJob = createInfrastructureSimulatorCron(io)

    weatherJob.start()
    telemetryJob.start()
    infrastructureJob.start()

    console.log('All 9 microgrid cron schedulers running successfully.')
}