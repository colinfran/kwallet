/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import express from "express"
import path from "path"
import http from "http"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"
import morgan from "morgan"
import { fileURLToPath } from "url"
import { initializeDatabase } from "./database/index.js"
import * as dotenv from "dotenv"
import * as Sentry from "@sentry/node"
import Tracing from "@sentry/tracing"
import cors from "cors"
import rateLimit from "express-rate-limit"
import apiRoute from "./routes/index.js"

import { initKaspaFramework } from "@kaspa/wallet"
import { initializeCronJobs } from "./cron/index.js"

const app = express()
const server = http.createServer(app)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()
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
const limiter = rateLimit({
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
})
app.use(limiter)
app.use(
  morgan("dev", {
    skip: (req, res) => {
      return req.url.includes("origin=betteruptime")
    },
  })
)
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(express.static("storage.json"))
app.use(express.static(__dirname + "/public"))

initializeDatabase()
initializeCronJobs()

/*
  Api endpoint
  Returns: graph data and wallet data
*/
app.use("/api", apiRoute)

/*
  Webpage endpoint
  Returns: webpage
*/
const privacy = ["/privacy", "/privacy.html"]
const terms = ["/terms", "/terms.html"]
const index = ["/", "/index", "index.html"]
app.get([...privacy, ...terms, ...index], (req, res) => {
  if (terms.includes(req.originalUrl)) {
    res.sendFile(__dirname + "/public/terms.html")
  } else if (privacy.includes(req.originalUrl)) {
    res.sendFile(__dirname + "/public/privacy.html")
  } else {
    res.sendFile(__dirname + "/public/index.html")
  }
})

app.get("/*", (req, res) => {
  return res.status(401).send("unauthorized")
})

app.use(Sentry.Handlers.errorHandler())

server.listen(3000, async () => {
  console.log("Listening on port 3000")
  console.log("Kaspa Framework initialization has started.")
  await initKaspaFramework()
  console.log("Kaspa Framework initialization has completed.")
})
