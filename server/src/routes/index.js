import express from "express"
import fs from "fs"
import fetch from "node-fetch"
import walletRoute from "./wallet/index.js"
import { getLineGraphData, isApiKeyValid } from "../functions/functions.js"
import { Wallet, network, rpc } from "../kaspa/index.js"
import { db } from "../database/index.js"

const route = express.Router()

/**
 * @route GET /api/data
 * @desc get data
 * @access Private
 * @returns {object} 200 - graph data and data associated with wallet
 * @returns {Error}  500 - Unexpected error
 */
route.post("/graph-data", async (req, res) => {
  if (!isApiKeyValid(req.body.apiKey)) {
    return res.status(401).send("unauthorized")
  }
  try {
    const { selectedCurrency } = req.body
    return res.json(await getLineGraphData(selectedCurrency))
  } catch (error) {
    console.log(error.toString())
    return res.status(500).send(error)
  }
})

/**
 * @route GET /api/storage
 * @desc get Coingecko data that is currently stored locally
 * @access Private
 * @returns {object} 200 - the Coingecko Kaspa data that is stored locally
 * @returns {Error}  500 - Unexpected error
 */
route.get("/storage", async (req, res) => {
  if (!isApiKeyValid(req.query.apiKey)) {
    return res.status(401).send("unauthorized")
  }
  try {
    const data = fs.readFileSync("./storage.json", "utf8")
    return res.json(JSON.parse(data))
  } catch (err) {
    console.log(err)
  }
})

/**
 * @route GET /api/email-sign-up
 * @desc add signup email and date to google sheet
 * @access Public
 * @returns {object} 200 - successfully added to google sheet
 * @returns {Error}  500 - Unexpected error
 */
route.post("/email-sign-up", async (req, res) => {
  const { email } = req.body
  const formData = new URLSearchParams({
    Email: email,
    Time: new Date().toISOString(),
  })
  try {
    const response = await fetch(
      // eslint-disable-next-line max-len
      "https://script.google.com/macros/s/AKfycbyv4akZsp_uvIG6hvoHibjqNEDHfaOysj9nZm9iBIlytpNn7zc8pANIFvM11EsCF_tK3A/exec",
      {
        method: "POST",
        body: formData,
      }
    )
    res.send(response)
  } catch (error) {
    res.status(401)
    console.log(error.toString())
  }
})

/**
 * @route GET /api/wallet
 * @desc router for wallets
 *        - create
 *        - import
 *        - send
 *        - transactions
 * @access Private
 * @returns {object} 200 - wallet data
 * @returns {Error}  500 - Unexpected error
 */
route.use("/wallet", walletRoute)

route.get("/*", async (req, res) => {
  return res.status(401).send("unauthorized")
})

export default route
