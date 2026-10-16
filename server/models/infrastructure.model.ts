import mongoose, {Document} from "mongoose";

export interface IInfrastructure extends Document {
  assetName: string;
  type: 'SolarArray' | 'Inverter' | 'BatteryBank';
  operatingTempC: number;
  efficiencyRating: number;
  degradationPercent: number;
  capacityKworKWh: number;
  status: 'Optimal' | 'Degraded' | 'MaintainanceRequired';
  lastMaintenanceDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const infrastructureSchema = new mongoose.Schema<IInfrastructure>({
    assetName: {
        type: String,
        required: [true, 'Please enter a name for your asset'],
        trim: true,
        minLength: [2, 'Asset name must be at least 2 characters long'],
        maxLength: [50, 'Asset name cannot exceed 50 characters']
    },
    type: {
        type: String,
        enum: ['SolarArray', 'Inverter', 'BatteryBank'],
        default: 'Inverter'
    },
    operatingTempC: {
        type: Number,
        required: true,
        min: [-100, 'Temprature must be more than -100C'],
        max: [100, 'Temprature must not exceed 100C']
    },
    efficiencyRating: {
        type: Number,
        required: true,
        min: [0, 'Efficiency Rating is invalid'],
        max: [100, 'Efficiency rating is invalid']
    },
    degradationPercent: {
        type: Number,
        required: true,
        min: [0, 'Degradation Percent is invalid'],
        max: [100, 'Degradation Percent is invalid']
    },
    capacityKworKWh: {
        type: Number,
        required: true,
        min: [0, 'Capacity must be more than 0'],
        max: [24, 'Capacity must not exceed 24']
    },
    status: {
        type: String,
        enum: ['Optimal', 'Degraded', 'MaintainanceRequired'],
        default: 'Optimal'
    },
    lastMaintenanceDate: {
        type: Date,
        required: true,
        validate: {
            validator: (date: Date) => date <= new Date(),
            message: 'Last maintainance date cannot be set to a future date'
        }
    }
},
{timestamps: true})

const Infrastructure = mongoose.model<IInfrastructure>('Infrastruture', infrastructureSchema)
export default Infrastructure