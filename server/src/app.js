/* eslint-disable @typescript-eslint/explicit-function-return-type */
import express from "express"
import path from "path"
import http from "http"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"
import logger from "morgan"
import cron from "node-cron"
import { fileURLToPath } from "url"
import { initializeDatabase } from "./database/index.js"
import * as dotenv from "dotenv"
import * as Sentry from "@sentry/node"
import Tracing from "@sentry/tracing"
import subdomain from "express-subdomain"

import { updateData, updateCurrentPrice, sleep } from "./functions/functions.js"
import apiRoute from "./routes/index.js"

import { initKaspaFramework } from "@kaspa/wallet"

const app = express()
const server = http.createServer(app)

dotenv.config()

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
    // Automatically instrument Node.js libraries and frameworks
    ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
})

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler())
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler())

app.use(logger("dev"))
app.use(express.json())
app.subdomain_app = express.Router()
app.use(subdomain("status", app.subdomain_app))

app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(bodyParser.json())

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.static("storage.json"))

app.use(express.static(__dirname + "/public"))
app.subdomain_app.use(express.static(__dirname + "/public"))

initializeDatabase()
// initializeKaspa()
/* 
  Coingecko graciously provides a free public api in which we pull our 
  data from. This server periodically refreshes its local database with 
  Coingecko's Kaspa data.


  International currencies supported: 
  -usd
  -euro
  -japanese yen
  -british pound
  -chinese yuan
  -australian dollar
  -canadian dollar
  -swiss franc

*/

const supportedCurrencies = [
  "usd",
  "eur",
  "jpy",
  "gbp",
  "cny",
  "aud",
  "cad",
  "chf",
]

// run every 8 minutes - currentPrice
cron.schedule("*/8 * * * *", async () => {
  for (const currency of supportedCurrencies) {
    await updateCurrentPrice(currency)
  }
})

// run every 15 minutes - 1D
cron.schedule("*/15 * * * *", async () => {
  await sleep(23)
  for (const currency of supportedCurrencies) {
    await updateData("1D", currency, 23)
  }
})

// run every 30 minutes - 1W
cron.schedule("*/30 * * * *", async () => {
  await sleep(33)
  for (const currency of supportedCurrencies) {
    await updateData("1W", currency, 33)
  }
})

// run every hour - 1M
cron.schedule("0 * * * *", async () => {
  await sleep(121)
  for (const currency of supportedCurrencies) {
    await updateData("1M", currency, 47)
  }
})

// run every 2 hours - 1Y
cron.schedule("0 */2 * * *", async () => {
  await sleep(77)
  for (const currency of supportedCurrencies) {
    await updateData("1Y", currency, 63)
  }
})

// run every 3 hours - ALL
cron.schedule("0 */3 * * *", async () => {
  await sleep(99)
  for (const currency of supportedCurrencies) {
    await updateData("ALL", currency, 73)
  }
})

/*
  Api endpoint
  Returns: graph data and wallet data
*/
app.use("/api", apiRoute)

app.subdomain_app.get("/", (req, res) => {
  return res.sendFile(__dirname + "/routes/status/index.html")
})

app.subdomain_app.get("/*", (req, res) => {
  return res.status(401).send("unauthorized")
})

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
