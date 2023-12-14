/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import express from "express"
import path from "path"
import http from "http"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"
import morgan from "morgan"
import { fileURLToPath } from "url"
import { initializeDatabase } from "../database/index.js"
import * as dotenv from "dotenv"
import * as Sentry from "@sentry/node"
import Tracing from "@sentry/tracing"
import cors from "cors"
import rateLimit from "express-rate-limit"
import swStats from "swagger-stats"

import v1Route from "../routes/v1/index.js"
import rootRoute from "../routes/index.js"

import { initKaspaFramework } from "@kaspa/wallet"
import { initializeCronJobs } from "../cron/index.js"

const app = express()
const server = http.createServer(app)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()

// sentry is used for production error and bug reporting
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({ app }),
    ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
  ],
  tracesSampleRate: 1.0,
})
app.use(Sentry.Handlers.requestHandler())
app.use(Sentry.Handlers.tracingHandler())

// request rate limitter to prevent spam requests
app.use(
  rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100, // Limit each IP to 60 requests per `window` (here, per 10 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
      error: true,
      error_code: 429,
      error_message:
        "Attention. You have exceeded the rate limit. You can only make 100 requests every 10 minutes.",
    },
    skip: (req) => {
      return req.url.includes("/swagger-stats/")
    },
  })
)

// ignore certain logs
app.use(
  morgan("dev", {
    skip: (req, res) => {
      return (
        req.url.includes("origin=betteruptime") ||
        req.url.includes("swagger-stats")
      )
    },
  })
)

// only admins will have access to the swagger stats dashboard
app.use(
  swStats.getMiddleware({
    authentication: true,
    onAuthenticate: function (req, username, password) {
      return (
        username === process.env.SWAGGER_USERNAME &&
        password === process.env.SWAGGER_PASSWORD
      )
    },
  })
)

app.use(express.json())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(bodyParser.json())
app.use(express.static(__dirname + "/public"))

initializeDatabase()
initializeCronJobs()

/*
  Api endpoints
  Returns: graph data and wallet data
*/
app.use("/v1", v1Route)

/*
  Webpage endpoints
  Returns: webpages
*/
app.use("/", rootRoute)

app.use(Sentry.Handlers.errorHandler())

server.listen(3000, async () => {
  console.log("Listening on port 3000")
  console.log("Kaspa Framework initialization has started.")
  await initKaspaFramework()
  console.log("Kaspa Framework initialization has completed.")
})
