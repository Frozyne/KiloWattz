import mongoose from "mongoose";

const houseHoldSchema = new mongoose.Schema({
    plotNumber: {
        type: String,
        required: [true, 'Please enter your plot'],
        trim: true,
        minLength: [1, 'Please enter a plot number'],
        maxLength: [50, 'Plot number is invalid']
    },
    street: {
        type: String,
        required: [true, 'Please enter your Name'],
        trim: true,
        minLength: [2, 'Street name must be at least 2 characters long'],
        maxLength: [50, 'Street name cannot exceed 50 characters']
    }
})