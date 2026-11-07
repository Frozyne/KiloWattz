import { Server } from 'socket.io'
import { initQuotaResetJob } from './reset.job'
import { initDailyReportJob } from './dailyreport.job'
import { initMeterHeartbeatJob } from './metermonitor.job'
import { initBatteryGuardJob } from './batterymonitor.job'
import { initTelemetryArchiveJob } from './archivecleaner.job'
import { createWeatherCronJob } from './weatherfetch.job'
import { createInfrastructureSimulatorCron } from './infrastructuresimulator.job'
import { startEnvironmentCleanupCron } from './environmentcleaner.job'
import { createTelemetryCron } from './telemetry.job'

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