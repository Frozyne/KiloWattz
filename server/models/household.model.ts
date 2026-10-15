import mongoose from "mongoose";

const householdSchema = new mongoose.Schema({
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
    dailyKWHQuota: {
        type: Number,
        required: true,
        min: [0, 'Daily Quota must be more than 0kwh'],
        max: [15, 'Daily Quota must not exceed 15kwh']
    },
    connectionStatus: {
        type: String,
        enum: ['Active', 'Suspended', 'Disconnected'],
        default: 'Disconnected'
    },
    meterSerialNumber: {
        type: String,
        trim: true,
        minLength: [10, 'Please enter a valid serial number'],
        maxLength: [15, 'Serial number is invalid']
    },
    phaseConnection: {
        type: String,
        enum: ['Phase 1', 'Phase 2', 'Phase 3'],
        default: 'Phase 1'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    }
},
{timestamps: true})

const Household = mongoose.model('Household', householdSchema)
export default Household