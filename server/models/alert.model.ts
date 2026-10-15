import mongoose from "mongoose";

const alertSchema = new mongoose.Schema({
    severity: {
        type: String,
        enum: ['Info', 'Warning', 'Critical'],
        default: 'Info'
    },
    category: {
        type: String,
        enum: ['Hardware', 'QuotaBreach', 'SOS', 'GridDeficit'],
        default: 'SOS'
    },
    message: {
        type: String,
        required: true,
        minLength: [0, 'Message can not be empty'],
        maxLength: [320, 'Message exceeds character limit']
    },
    source: {
        type: String,
        required: true,
        minLength: [2, 'Source name passed is invalid'],
        maxLength: [50, 'Source name passed exceeds character limit']
    },
    resolved: {
        type: Boolean,
        required: true
    },
    resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    }
},
{timestamps: true})

const Alert = mongoose.model('Alert', alertSchema)
export default Alert