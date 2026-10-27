import {Router} from 'express'
import { signIn, signOut } from '../controllers/auth.controller'

const authRouter: Router = Router()

authRouter.post('/sign-in', signIn)
authRouter.post('/sign-out', signOut)

export default authRouter