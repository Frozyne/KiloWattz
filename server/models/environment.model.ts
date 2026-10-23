import mongoose, {Document} from "mongoose";

export interface IEnvironment extends Document {
    cloudCoverPercent: number
    temperatureC: number
    solarIrradiance: number // W/m²
    expectedYieldKW: number
    timestamp: Date
    createdAt: Date
    updatedAt: Date
}

const enviromentSchema = new mongoose.Schema<IEnvironment>({
        cloudCoverPercent: {
            type: Number,
            required: true,
            min: [0, 'Cloud cover percent cannot be negative'],
            max: [100, 'Cloud cover percent cannot exceed 100']
        },
        temperatureC: {
            type: Number,
            required: true,
            min: [-50, 'Temperature out of lower bound'],
            max: [80, 'Temperature out of upper bound']
        },
        solarIrradiance: {
            type: Number,
            required: true,
            min: [0, 'Solar irradiance cannot be negative']
        },
        expectedYieldKW: {
            type: Number,
            required: true,
            min: [0, 'Expected yield cannot be negative']
        },
        timestamp: {
            type: Date,
            default: Date.now,
            index: true
        }
    },
    { timestamps: true })

const Enviroment = mongoose.model<IEnvironment>('Enviroment', enviromentSchema)
export default Enviroment