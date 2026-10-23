import mongoose, {Document} from "mongoose";

export interface IMaintenanceLog {
    performedAt: Date
    performedBy: string
    notes: string
    statusAfter: 'Operational' | 'MaintenanceRequired' | 'UnderMaintenance' | 'Offline'
}

export interface IInfrastructure extends Document {
    name: string
    type: 'SolarArray' | 'Inverter' | 'BatteryBank' | 'Transformer' | 'Gateway'
    capacityKW?: number
    capacityKWh?: number
    status: 'Operational' | 'MaintenanceRequired' | 'UnderMaintenance' | 'Offline'
    healthPercent: number
    lastMaintenanceDate?: Date
    diagnostics: {
        voltageV?: number
        temperatureC?: number
        efficiencyPercent?: number
        currentOutputKW?: number
        stateOfChargePercent?: number
    }
    maintenanceLogs: IMaintenanceLog[]
}

const maintenanceLogSchema = new mongoose.Schema<IMaintenanceLog>({
        performedAt: { type: Date, default: Date.now },
        performedBy: { type: String, required: true },
        notes: { type: String, required: true },
        statusAfter: { 
            type: String, 
            enum: ['Operational', 'MaintenanceRequired', 'UnderMaintenance', 'Offline'], 
            required: true 
        }
    },
    { _id: false }
)

const infrastructureSchema = new mongoose.Schema<IInfrastructure>({
        name: { type: String, required: true },
        type: { 
            type: String, 
            enum: ['SolarArray', 'Inverter', 'BatteryBank', 'Transformer', 'Gateway'], 
            required: true 
        },
        capacityKW: { type: Number },
        capacityKWh: { type: Number },
        status: { 
            type: String, 
            enum: ['Operational', 'MaintenanceRequired', 'UnderMaintenance', 'Offline'], 
            default: 'Operational' 
        },
        healthPercent: { type: Number, default: 100, min: 0, max: 100 },
        lastMaintenanceDate: { type: Date },
        diagnostics: {
            voltageV: Number,
            temperatureC: Number,
            efficiencyPercent: Number,
            currentOutputKW: Number,
            stateOfChargePercent: Number
        },
        maintenanceLogs: [maintenanceLogSchema]
    },
    { timestamps: true })

const Infrastructure = mongoose.model<IInfrastructure>('Infrastructure', infrastructureSchema)
export default Infrastructure