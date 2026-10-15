import express, { type Express, type Request, type Response } from "express"
import cors from "cors"
import morgan from "morgan"
import helmet from "helmet"
import { CLIENT_URL, NODE_ENV, PORT } from "./config/config.ts";
import connectToDB from "./config/db_config.ts";


const app: Express = express();
app.set('trust proxy', 1)

const allowedOrigins = (CLIENT_URL || 'http:localhost:3000').split(',').map((url) => url.trim()).filter(Boolean)

app.use(
  cors({
    origin(origin, callback) {
      if(!origin || allowedOrigins.includes(origin)) {
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

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

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

startServer()

export default app