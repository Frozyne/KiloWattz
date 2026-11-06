import {Router} from 'express'
import { signIn, signOut, handleRefreshToken } from '../controllers/auth.controller'

const authRouter: Router = Router()

authRouter.post('/sign-in', signIn)
authRouter.post('/sign-out', signOut)
authRouter.post('/refresh', handleRefreshToken)

export default authRouter