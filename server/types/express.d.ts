import { IUser } from '../models/user.model.ts' // Replace with your User Mongoose interface

declare global {
    namespace Express {
        interface Request {
            user?: IUser // Allows req.user on all protected controllers
            cookies?: {
                token?: string
                [key: string]: any
            }
        }
    }
}