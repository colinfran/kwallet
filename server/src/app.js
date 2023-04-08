/* eslint-disable @typescript-eslint/explicit-function-return-type */
import express from "express"
import path from "path"
import http from "http"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"
import logger from "morgan"
import cron from "node-cron"
import { fileURLToPath } from "url"
import { initializeKaspa } from "./kaspa/index.js"
import { initializeDatabase } from "./database/index.js"
import * as dotenv from "dotenv"
import * as Sentry from "@sentry/node"
import Tracing from "@sentry/tracing"
import { Server } from "socket.io"
import { Wallet, network, rpc } from "./kaspa/index.js"

import { updateData, updateCurrentPrice, sleep } from "./functions/functions.js"
import apiRoute from "./routes/index.js"

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:19000",
  },
})

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
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(bodyParser.json())

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.static("storage.json"))

app.use(express.static(__dirname + "/public"))

initializeDatabase()
initializeKaspa()

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

cron.schedule("*/8 * * * *", async () => {
  // run every 8 minutes - currentPrice
  await updateCurrentPrice("usd")
  await updateCurrentPrice("eur")
  await updateCurrentPrice("jpy")
  await updateCurrentPrice("gbp")
  await updateCurrentPrice("cny")
  await updateCurrentPrice("aud")
  await updateCurrentPrice("cad")
  await updateCurrentPrice("chf")
})

cron.schedule("*/15 * * * *", async () => {
  // run every 15 minutes - 1D
  await sleep(23)
  await updateData("1D", "usd", 23)
  await updateData("1D", "eur", 23)
  await updateData("1D", "jpy", 23)
  await updateData("1D", "gbp", 23)
  await updateData("1D", "cny", 23)
  await updateData("1D", "aud", 23)
  await updateData("1D", "cad", 23)
  await updateData("1D", "chf", 23)
})

cron.schedule("*/30 * * * *", async () => {
  await sleep(33)
  // run every 30 minutes - 1W
  await updateData("1W", "usd", 33)
  await updateData("1W", "eur", 33)
  await updateData("1W", "jpy", 33)
  await updateData("1W", "gbp", 33)
  await updateData("1W", "cny", 33)
  await updateData("1W", "aud", 33)
  await updateData("1W", "cad", 33)
  await updateData("1W", "chf", 33)
})

cron.schedule("0 * * * *", async () => {
  await sleep(121)
  // run every hour - 1M
  await updateData("1M", "usd", 21)
  await updateData("1M", "eur", 21)
  await updateData("1M", "jpy", 21)
  await updateData("1M", "gbp", 21)
  await updateData("1M", "cny", 21)
  await updateData("1M", "aud", 21)
  await updateData("1M", "cad", 21)
  await updateData("1M", "chf", 21)
})

cron.schedule("0 */2 * * *", async () => {
  // run every 2 hours - 1Y
  await sleep(77)
  await updateData("1Y", "usd", 63)
  await updateData("1Y", "eur", 63)
  await updateData("1Y", "jpy", 63)
  await updateData("1Y", "gbp", 63)
  await updateData("1Y", "cny", 63)
  await updateData("1Y", "aud", 63)
  await updateData("1Y", "cad", 63)
  await updateData("1Y", "chf", 63)
})

cron.schedule("0 */3 * * *", async () => {
  // run every 3 hours - ALL
  await sleep(99)
  await updateData("ALL", "usd", 73)
  await updateData("ALL", "eur", 73)
  await updateData("ALL", "jpy", 73)
  await updateData("ALL", "gbp", 73)
  await updateData("ALL", "cny", 73)
  await updateData("ALL", "aud", 73)
  await updateData("ALL", "cad", 73)
  await updateData("ALL", "chf", 73)
})

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
const index = ["/*"]
app.get([...privacy, ...terms, ...index], (req, res) => {
  if (terms.includes(req.originalUrl)) {
    res.sendFile(__dirname + "/public/terms.html")
  } else if (privacy.includes(req.originalUrl)) {
    res.sendFile(__dirname + "/public/privacy.html")
  } else {
    res.sendFile(__dirname + "/public/index.html")
  }
})

app.use(Sentry.Handlers.errorHandler())

// socketio to provide event updates to wallet balance
io.on("connection", async (socket) => {
  console.log("A wallet has connected through the socket io server connection:")
  socket.on("wallet-balance--get", async (walletData) => {
    const { password, encryptedMnemonic } = walletData
    let wallet = await Wallet.import(password, encryptedMnemonic, {
      network,
      rpc,
    })
    wallet.sync()
    io.emit("wallet-balance--has-been-updated", wallet.balance)
    const balanceHandler = (balance) => {
      io.emit("wallet-balance--has-been-updated", balance)
    }
    wallet.on("walletBalance", balanceHandler)
    wallet.removeEventListener("walletBalance", balanceHandler)
  })
})

server.listen(3000, () => {
  console.log("Listening on port 3000")
})
