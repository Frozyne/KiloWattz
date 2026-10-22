import mongoose, { Schema, Document } from 'mongoose'

export interface ISetting extends Document {
    key: string
    value: number
    description?: string
}

const settingSchema = new Schema<ISetting>(
    {
        key: { type: String, required: true, unique: true }, // e.g., 'gridTariffPerKWh'
        value: { type: Number, required: true },
        description: { type: String }
    },
    { timestamps: true }
)
const Setting = mongoose.model<ISetting>('Setting', settingSchema)
export default Setting