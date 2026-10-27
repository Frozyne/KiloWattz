import express, { type Express, type Request, type Response } from "express"
import cors from "cors";
import morgan from "morgan"
import helmet from "helmet"
import { CLIENT_URL, NODE_ENV, PORT } from "./config/config.ts";
import connectToDB from "./config/db_config.ts";
import cookieParser from 'cookie-parser'
import { errorHandler } from "./middlewares/error.middleware.ts";
import authRouter from './routes/auth.route.ts'
import userRouter from './routes/user.route.ts'
import householdRouter from './routes/household.route.ts'
import telemetryRouter from './routes/telemetry.route.ts'
import quotaRouter from './routes/quota.route.ts'
import infrastructureRouter from "./routes/infrastructure.route.ts";
import alertRouter from "./routes/alert.route.ts";
import apiRouter from "./routes/api.route.ts";

import { startAllCronJobs } from "./jobs/index.ts";


const app: Express = express();
app.set('trust proxy', 1)

const allowedOrigins = new Set((CLIENT_URL || 'http:localhost:3000').split(',').map((url) => url.trim()).filter(Boolean))

app.use(
  cors({
    origin(origin, callback) {
      if(!origin || allowedOrigins.has(origin)) {
        return callback(null, true)
      }
      return callback(new Error(`CORS blocked for origin ${origin}`))
    },
    credentials: true
  })
)

app.use(helmet())
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'))
app.use(express.json())
app.use(cookieParser())

app.get('/health', (req: Request, res: Response) => {
  res
    .status(200)
    .json({
        status: 'Operational',
        timestamp: new Date().toISOString(),
        uptimeSeconds: Math.floor(process.uptime())
    })
});

app.use('/auth', authRouter)
app.use('/user', userRouter)
app.use('/household', householdRouter)
app.use('/telemetry', telemetryRouter)
app.use('/quota', quotaRouter)
app.use('/infrastructure', infrastructureRouter)
app.use('/alert', alertRouter)
app.use('/api', apiRouter)


app.use(errorHandler)

await connectToDB()

const startServer = () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    });
  } catch (error) {
    console.log('Error starting server', error)
    process.exit(1)
  }
}

startAllCronJobs()

startServer()

process.on('unhandledRejection', (reason: Error) => {
    console.error('Unhandled Rejection:', reason.message || reason)
})

export default app