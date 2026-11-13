import mongoose, { Document, Types, type PopulatedDoc } from "mongoose";
import type { IUser } from "./user.model.js";

export interface IQuotaBreach {
    breachedAt: Date
    consumedKWh: number
    dailyQuotaKWh: number
}

export interface ITerminal {
    name: string,
    consumedKWh: number,
    connectionStatus: 'On' | 'Off' | 'Fault'
}

export interface IMeter {
    terminal1: ITerminal,
    terminal2: ITerminal,
    terminal3: ITerminal,
    terminal4: ITerminal,
    terminal5: ITerminal,
    terminal6: ITerminal
}

export interface IHousehold extends Document {
  plotNumber: string;
  street: string;
  consumedKWh?: number
  dailyKWHQuota: number;
  connectionStatus: 'Active' | 'Suspended' | 'Disconnected';
  quotaBreaches: IQuotaBreach[]; // Array of quota breach records
  meterSerialNumber?: string; // Optional since it has no required: true validator
  meter: IMeter; // Optional since it has no required: true validator  
  phaseConnection: 'Phase 1' | 'Phase 2' | 'Phase 3';
  user: Types.ObjectId | PopulatedDoc<IUser>; // Reference to User model
  createdAt: Date;
  updatedAt: Date;
}

const terminalSchema = new mongoose.Schema<ITerminal>({
    name: {type: String},
    consumedKWh: {type: Number},
    connectionStatus: {
        type: String,
        enum: ['On', 'Off', 'Fault'],
        default: 'On'
    }
})

const meterSchema = new mongoose.Schema<IMeter>({
    terminal1: terminalSchema, 
    terminal2: terminalSchema,
    terminal3: terminalSchema,
    terminal4: terminalSchema,
    terminal5: terminalSchema,
    terminal6: terminalSchema,
})

const quotaBreachSchema = new mongoose.Schema<IQuotaBreach>({
    breachedAt: { 
        type: Date, 
        default: Date.now 
    },
    consumedKWh: { 
        type: Number, 
        required: true 
    },
    dailyQuotaKWh: { 
        type: Number, 
        required: true 
    }
}, { _id: false })

const householdSchema = new mongoose.Schema<IHousehold>({
    plotNumber: {
        type: String,
        required: [true, 'Please enter your plot'],
        trim: true,
        minLength: [1, 'Please enter a plot number'],
        maxLength: [50, 'Plot number is invalid']
    },
    street: {
        type: String,
        required: [true, 'Please enter your street'],
        trim: true,
        minLength: [2, 'Street name must be at least 2 characters long'],
        maxLength: [50, 'Street name cannot exceed 50 characters']
    },
    consumedKWh: {
        type: Number,
        default: 0,
        min: [0, 'Consumed KWh cannot be negative']
    },
    dailyKWHQuota: {
        type: Number,
        required: true,
        min: [0, 'Allocated Quota must be more than 0kwh'],
        max: [15, 'Allocated Quota must not exceed 15kwh']
    },
    connectionStatus: {
        type: String,
        enum: ['Active', 'Suspended', 'Disconnected'],
        default: 'Disconnected'
    },
    quotaBreaches: [quotaBreachSchema],
    meterSerialNumber: {
        type: String,
        trim: true,
        unique: true,
        minLength: [10, 'Please enter a valid serial number'],
        maxLength: [15, 'Serial number is invalid']
    },
    meter: meterSchema,
    phaseConnection: {
        type: String,
        enum: ['Phase 1', 'Phase 2', 'Phase 3'],
        default: 'Phase 1'
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    }
},
{timestamps: true})

const Household = mongoose.model<IHousehold>('Household', householdSchema)
export default Household