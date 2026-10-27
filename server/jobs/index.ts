import { initQuotaResetJob } from './reset.job'
import { initDailyReportJob } from './dailyreport.job'
import { initMeterHeartbeatJob } from './metermonitor.job'
import { initBatteryGuardJob } from './batterymonitor.job'
import { initTelemetryArchiveJob } from './archivecleaner.job'
import { initWeatherCronJob } from './weatherfetch.job'

export const startAllCronJobs = (): void => {
    console.log('Initializing Microgrid Background Task Schedulers...')
    
    initQuotaResetJob()
    initDailyReportJob()
    initMeterHeartbeatJob()
    initBatteryGuardJob()
    initTelemetryArchiveJob()
    initWeatherCronJob()

    console.log('All 6 microgrid cron schedulers running successfully.')
}