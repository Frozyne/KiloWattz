import mongoose, { Document, Types, PopulatedDoc } from "mongoose";
import { IUser } from "./user.model";
import { IHousehold } from "./household.model";
import { IInfrastructure } from "./infrastructure.model";

export interface IAlert extends Document {
    title: string
    message: string
    severity: 'Info' | 'Warning' | 'Critical' | 'Emergency'
    scope: 'System' | 'Household' | 'Infrastructure'
    household?: PopulatedDoc<IHousehold>
    infrastructure?: PopulatedDoc<IInfrastructure>
    isResolved: boolean
    resolvedAt?: Date
    resolvedBy?: Types.ObjectId | PopulatedDoc<IUser>
    metadata?: Record<string, any>
    createdAt: Date
    updatedAt: Date
}

const alertSchema = new mongoose.Schema<IAlert>(
    {
        title: { type: String, required: true },
        message: { type: String, required: true },
        severity: { 
            type: String, 
            enum: ['Info', 'Warning', 'Critical', 'Emergency'], 
            default: 'Info',
            index: true
        },
        scope: { 
            type: String, 
            enum: ['System', 'Household', 'Infrastructure'], 
            default: 'System',
            index: true
        },
        household: { type: mongoose.Schema.Types.ObjectId, ref: 'Household', index: true },
        infrastructure: { type: mongoose.Schema.Types.ObjectId, ref: 'Infrastructure' },
        isResolved: { type: Boolean, default: false, index: true },
        resolvedAt: { type: Date },
        resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        metadata: { type: mongoose.Schema.Types.Mixed }
    },
    { timestamps: true })

const Alert = mongoose.model<IAlert>('Alert', alertSchema)
export default Alert