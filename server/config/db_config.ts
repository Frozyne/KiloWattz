import mongoose from "mongoose"
import { MONGODB_URI, NODE_ENV } from "./config.ts"

if (!MONGODB_URI) {
    throw new Error('MONGODB URI is not defined in enviroment variables')
}

const connectToDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI!)
        console.log(`Database connected successfully in ${NODE_ENV} mode`)
    } catch (error) {
        console.log('Error connecting to MongoDB', error)
        process.exit(1)
    }
}

export default connectToDB