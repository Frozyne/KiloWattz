import mongoose from "mongoose";

const quotaRecordSchema = new mongoose.Schema({
    houseHold: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Household',
        required: true,
        index: true
    },
    date: {
        type: String,
        required: true,
        trim: true
    },
    allocatedQuotaKWh: {
        type: Number,
        required: true,
        min: [0, 'Allocated Quota must be more than 0kwh'],
        max: [15, 'Allocated Quota must not exceed 15kwh']
    },
    consumedKWh: {
        type: Number,
        required: true,
        min: [0, 'Power Consumed must be more than 0kwh'],
        max: [50, 'Power Consumed must not exceed 50kwh']
    },
    quotaBreached: {
        type: Boolean,
        required: true
    }
},
{timestamps: true})

const QuotaRecord = mongoose.model('QuotaRecord', quotaRecordSchema)
export default QuotaRecord