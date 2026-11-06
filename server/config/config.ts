import { config } from "dotenv";

config({path: `.env.${process.env.NODE_ENV || 'development'}.local`, quiet: true})

export const {
    CLIENT_URL, 
    PORT, 
    NODE_ENV, 
    MONGODB_URI, 
    JWT_SECRET, 
    JWT_REFRESH_EXPIRES_IN, 
    JWT_ACCESS_EXPIRES_IN,
    JWT_ACCESS_SECRET, 
    JWT_REFRESH_SECRET, 
    ESTATE_LAT, 
    ESTATE_LNG,
    SOLAR_CAPACITY_KW
} = process.env