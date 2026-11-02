import { initQuotaResetJob } from './reset.job'
import { initDailyReportJob } from './dailyreport.job'
import { initMeterHeartbeatJob } from './metermonitor.job'
import { initBatteryGuardJob } from './batterymonitor.job'
import { initTelemetryArchiveJob } from './archivecleaner.job'
import { initWeatherCronJob } from './weatherfetch.job'
import { startInfrastructureSimulatorCron } from './infrastructuresimulator.job'
import { startEnvironmentCleanupCron } from './environmentcleaner.job'
import { startHouseholdTelemetryCron } from './telementry.job'

export const startAllCronJobs = (): void => {
    console.log('Initializing Microgrid Background Task Schedulers...')
    
    initQuotaResetJob()
    initDailyReportJob()
    initMeterHeartbeatJob()
    initBatteryGuardJob()
    initTelemetryArchiveJob()
    initWeatherCronJob()
    startInfrastructureSimulatorCron()
    startEnvironmentCleanupCron()
    startHouseholdTelemetryCron()

    console.log('All 9 microgrid cron schedulers running successfully.')
}