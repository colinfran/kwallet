/* eslint-disable @typescript-eslint/explicit-function-return-type */
import express from "express"
import path from "path"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"
import logger from "morgan"
import cron from "node-cron"
import fs from "fs"
import JSONdb from "simple-json-db"
import { triggerDataRefresh, getData } from "./data-functions/index.js"

import { Wallet, initKaspaFramework, kaspacore } from "@kaspa/wallet"
import { RPC } from "@kaspa/grpc-node"
import data from "./data.json"

const env = process.env.NODE_ENV
import { fileURLToPath } from "url"

const app = express()

app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(bodyParser.json())

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

if (!fs.existsSync("./storage.json")) {
  fs.writeFileSync("./storage.json", JSON.stringify(data))
}

app.use(express.static("storage.json"))

const db = new JSONdb("./storage.json", { asyncWrite: true })

app.use(express.static(__dirname + "/public"))

await initKaspaFramework()
const network = "kaspatest"
const { port } = Wallet.networkTypes[network].port
const rpc = new RPC({ clientConfig: { host: "127.0.0.1:" + port } })

cron.schedule("*/15 * * * *", async () => {
  console.log("---------------------")
  console.log("Data Refresh Occured.")
  console.log("Updating local database")
  await triggerDataRefresh(db)
  console.log("Data refresh complete.")
  console.log("Refreshing data again in 15 minute.")
  console.log("---------------------")
})

/*
  API USER DATA ROUTE
*/

app.post("/api/data", async (req, res, next) => {
  const password = req.body.password
  const encryptedMnemonic = req.body.encryptedMnemonic
  const wallet = await Wallet.import(password, encryptedMnemonic, {
    network,
    rpc,
  })
  wallet.sync(true)
  return res.json(await getData(db, wallet))
})

/*
  API Wallet ROUTES
*/

app.post("/api/wallet/create", async (req, res) => {
  const password = req.body.password
  console.log(password)
  try {
    const wallet = new Wallet(null, null, { network, rpc })
    const encryptedMnemonic = await wallet.export(password)
    return res.json({
      address: wallet.addressManager.getAddresses()[0].address,
      mnemonic: wallet.mnemonic,
      encryptedMnemonic: encryptedMnemonic,
      userPassword: password,
    })
  } catch (error) {
    console.log(error)
    return res.json({
      error: true,
      errorMessage: error,
      errorDesrciption: "Error message",
    })
  }
})

app.post("/api/wallet/import", async (req, res) => {
  try {
    const userData = JSON.stringify(req.body)
    const encryptedMnemonic = Wallet.Crypto.encrypt(userData.mnemonic)
    const wallet = await Wallet.import(userData.password, encryptedMnemonic, {
      network,
      rpc,
    })
    return res.json({
      address: wallet.addressManager.getAddresses()[0].address,
      mnemonic: wallet.mnemonic,
      encryptedMnemonic: encryptedMnemonic,
      userPassword: userData.password,
    })
  } catch (error) {
    return res.json({
      error: true,
      errorMessage: error,
      errorDesrciption: "Error message",
    })
  }
})

/*
  WEB PAGE ROUTES
*/

app.get(["/terms", "/terms.html"], (req, res, next) => {
  res.sendFile(__dirname + "/public/terms.html")
})

app.get(["/privacy", "/privacy.html"], (req, res, next) => {
  res.sendFile(__dirname + "/public/privacy.html")
})

app.get("/storage", (req, res, next) => {
  try {
    const data = fs.readFileSync("./storage.json", "utf8")
    return res.json(JSON.parse(data))
  } catch (err) {
    console.error(err)
  }
})

app.get("/*", (req, res, next) => {
  res.sendFile(__dirname + "/public/index.html")
})

triggerDataRefresh(db)

export default app
