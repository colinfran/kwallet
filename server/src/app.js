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
  Route list: 
        - "/privacy", "/privacy.html"
        - "/terms", "/terms.html", 
        - "/index", "index.html" 
        - "/*"
  Use: App website / Terms of Use
  Returns: the terms of use page
*/
const privacy = ["/privacy", "/privacy.html"]
const terms = ["/terms", "/terms.html"]
const index = ["/*"]
app.get([...privacy, ...terms, ...index], (req, res) => {
  console.log("req", req.originalUrl)
  if (terms.includes(req.originalUrl)) {
    res.sendFile(__dirname + "/public/terms.html")
  } else if (privacy.includes(req.originalUrl)) {
    res.sendFile(__dirname + "/public/privacy.html")
  } else {
    res.sendFile(__dirname + "/public/index.html")
  }
})

export default app
