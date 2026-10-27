import mongoose, { Document } from 'mongoose'

export interface IDailyReport extends Document {
    date: Date
    totalSolarGeneratedKWh: number
    totalEnergyConsumedKWh: number
    peakPowerDemandKW: number
    totalQuotaBreaches: number
    averageBatterySoCPercent: number
}

const dailyReportSchema = new mongoose.Schema<IDailyReport>(
    {
        date: { type: Date, required: true, unique: true, index: true },
        totalSolarGeneratedKWh: { type: Number, default: 0 },
        totalEnergyConsumedKWh: { type: Number, default: 0 },
        peakPowerDemandKW: { type: Number, default: 0 },
        totalQuotaBreaches: { type: Number, default: 0 },
        averageBatterySoCPercent: { type: Number, default: 0 }
    },
    { timestamps: true }
)

export default mongoose.model<IDailyReport>('DailyReport', dailyReportSchema)