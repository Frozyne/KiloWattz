import mongoose from "mongoose";

const telementrySchema = new mongoose.Schema({
    timestamp: {
        type: Date,
        required: true,
        validate: {
            validator: (date: Date) => date <= new Date(),
            message: 'Timestamp is set to future date'
        }
    },
    scope: {
        type: String,
        enum: ['Community', 'Household'],
        default: 'Community'
    },
    houseHold: {
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

const Telementry = mongoose.model('Telementry', telementrySchema)
export default Telementry