import mongoose, {Document, Types} from "mongoose";

export interface IQuotaRecord extends Document {
  household: Types.ObjectId;
  date: string;
  allocatedQuotaKWh: number;
  consumedKWh: number;
  quotaBreached: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const quotaRecordSchema = new mongoose.Schema<IQuotaRecord>({
    household: {
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

const QuotaRecord = mongoose.model<IQuotaRecord>('QuotaRecord', quotaRecordSchema)
export default QuotaRecord