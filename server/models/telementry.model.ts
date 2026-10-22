import mongoose, {Document, Types, PopulatedDoc} from "mongoose";
import { IHousehold } from "./household.model.ts";

export interface ITelemetry extends Document {
  timestamp: Date;
  scope: 'Community' | 'Household';
  household: Types.ObjectId | PopulatedDoc<IHousehold>; // Reference to Household model
  solarGeneratedKW: number;
  powerConsumedKW: number;
  batteryLevelPercent: number;
  gridVoltage: number;
  createdAt: Date;
  updatedAt: Date;
}

const telementrySchema = new mongoose.Schema<ITelemetry>({
    timestamp:{
        type:Date,
        default:Date.now
    },
    scope: {
        type: String,
        enum: ['Community', 'Household'],
        default: 'Community'
    },
    household: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Household',
        required: true,
        index: true
    },
    solarGeneratedKW: {
        type: Number,
        required: true,
        min: [0, 'Generated Power must be more than 0'],
        max: [350, 'Generated Power can not exceed 350']
    },
    powerConsumedKW: {
        type: Number,
        required: true,
        min: [0, 'Consumed Power must be more than 0'],
        max: [350, 'Consumed Power can not exceed 350']
    },
    batteryLevelPercent: {
        type: Number,
        required: true,
        min: [0, 'Battery Level is invalid'],
        max: [100, 'Battery Level is invalid']
    },
    gridVoltage: {
        type: Number,
        required: true,
        min: [0, 'Grid Voltage must be more than 0'],
        max: [500, 'Grid Voltage can not exceed 500']
    }
},
{timestamps: true})

const Telementry = mongoose.model<ITelemetry>('Telementry', telementrySchema)
export default Telementry