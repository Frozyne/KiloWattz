import { Request } from 'express' // Import the extended Request type
import { IUser } from '../models/user.model.ts' // Replace with your User Mongoose interface

export interface AuthenticatedRequest extends Request {
    user?: IUser // Optional user property, will be populated after authentication
}