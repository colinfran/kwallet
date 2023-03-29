import express from "express"
import fs from "fs"
import walletRoute from "./wallet/index.js"
import { getData } from "../functions/functions.js"
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
route.post("/data", async (req, res) => {
  const password = req.body.password
  const encryptedMnemonic = req.body.encryptedMnemonic

  const wallet = await Wallet.import(password, encryptedMnemonic, {
    network,
    rpc,
  })
  wallet.sync(true)
  try {
    return res.json(await getData(db, wallet))
  } catch (error) {
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
  try {
    const data = fs.readFileSync("./storage.json", "utf8")
    return res.json(JSON.parse(data))
  } catch (err) {
    console.log(err)
  }
})

/**
 * @route GET /api/wallet
 * @desc router for wallets
 *        - create
 *        - import
 * @access Private
 * @returns {object} 200 - wallet data
 * @returns {Error}  500 - Unexpected error
 */
route.use("/wallet", walletRoute)

export default route
