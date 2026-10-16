import mongoose, {Document} from "mongoose";

export interface IEnvironment extends Document {
  cloudCoverPercent: number;
  tempratureC: number;
  solarIrradiance: number;
  expectedYieldKW: number;
  createdAt: Date;
  updatedAt: Date;
}

const enviromentSchema = new mongoose.Schema<IEnvironment>({
    cloudCoverPercent: {
        type: Number,
        required: true,
        min: [0, 'Cloud cover Percent is invalid'],
        max: [100, 'Cloud cover Degradation Percent is invalid']
    },
    tempratureC: {
        type: Number,
        required: true,
        min: [-100, 'Temprature must be more than -100C'],
        max: [100, 'Temprature must not exceed 100C']
    },
    solarIrradiance: {
        type: Number,
        required: true,
        min: [0, 'Solar irradiance cannot be less than 0'],
        max: [1500, 'Solar irradiance can not exceed 1500']
    },
    expectedYieldKW: {
        type: Number,
        required: true,
        min: [0, 'Expected Power must be more than 0'],
        max: [350, 'Expected Power can not exceed 350']
    }
},
{timestamps: true})

const Enviroment = mongoose.model<IEnvironment>('Enviroment', enviromentSchema)
export default Enviroment