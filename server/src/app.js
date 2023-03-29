/* eslint-disable @typescript-eslint/explicit-function-return-type */
import express from "express"
import path from "path"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"
import logger from "morgan"
import cron from "node-cron"
import { fileURLToPath } from "url"
import { initializeKaspa } from "./kaspa/index.js"
import { initializeDatabase } from "./database/index.js"

import { triggerDataRefresh } from "./routes/functions/functions.js"
import apiRoute from "./routes/index.js"

const app = express()

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
  Cron schedule to refresh data every 15 minutes.
  -
  Coingecko graciously provides a free public api in which we pull our 
  data from. This server periodically refreshes its local database of 
  Coingecko's Kaspa data. To prevent overuse of the Coingecko api, 
  this server will refresh data every 15 minutes.
*/
cron.schedule("*/15 * * * *", async () => {
  console.log("---------------------")
  console.log("Data Refresh Occured.")
  console.log("Updating local database")
  await triggerDataRefresh()
  console.log("Data refresh complete.")
  console.log("Refreshing data again in 15 minute.")
  console.log("---------------------")
})

/*
  Route: /api
  Use: api endpoint
  Returns: graph data and data associated with wallet
*/
app.use("/api", apiRoute)

/*
  Route: /terms
  Use: App website / Terms of Use
  Returns: the terms of use page
*/
app.get(["/terms", "/terms.html"], (req, res) => {
  res.sendFile(__dirname + "/public/terms.html")
})

/*
  Route: /storage
  Use: App website / Privacy Policy
  Returns: the privacy policy page
*/
app.get(["/privacy", "/privacy.html"], (req, res) => {
  res.sendFile(__dirname + "/public/privacy.html")
})

/*
  Route: /
  Use: App website
  Returns: the root home page
*/
app.get("/*", (req, res) => {
  res.sendFile(__dirname + "/public/index.html")
})

triggerDataRefresh()

export default app
