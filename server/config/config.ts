import { config } from "dotenv";

config({path: `.env.${process.env.NODE_ENV || 'development'}.local`, quiet: true})

export const {CLIENT_URL , PORT, NODE_ENV, MONGODB_URI, JWT_SECRET, JWT_EXPIRES_IN} = process.env