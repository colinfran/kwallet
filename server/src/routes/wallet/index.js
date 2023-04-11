import express from "express"
const route = express.Router()
import { Wallet, network } from "../../kaspa/index.js"
import { isApiKeyValid } from "../../functions/functions.js"
/**
 * @route POST /api/wallet/create
 * @desc get newly created Kaspa wallet data
 * @access Private
 * @returns {object} 200 - newly created Kaspa wallet data
 * @returns {Error}  500 - Unexpected error
 */
route.post("/create", async (req, res) => {
  if (!isApiKeyValid(req.body.apiKey)) {
    console.log("invalid apiKey")
    return res.status(401).send("unauthorized")
  }

  await networkSync()
  const { password } = req.body
  try {
    const wallet = new Wallet(null, null, { network, rpc })
    const encryptedMnemonic = await wallet.export(password)
    await wallet.sync(true)
    res.json({
      address: wallet.addressManager.getAddresses()[0].address,
      mnemonic: wallet.mnemonic,
      encryptedMnemonic: encryptedMnemonic,
      userPassword: password,
    })
  } catch (error) {
    console.log(error.toString())
    res.status(500).send({
      error: true,
      errorMessage: error.toString(),
      errorDesrciption: "Error message",
    })
  }
  return rpc.disconnect()
})

/**
 * @route POST /api/wallet/import
 * @desc get imported Kaspa wallet data
 * @access Private
 * @returns {object} 200 - imported Kaspa wallet data
 * @returns {Error}  500 - Unexpected error
 */
route.post("/import", async (req, res) => {
  if (!isApiKeyValid(req.body.apiKey)) {
    console.log("invalid apiKey")
    return res.status(401).send("unauthorized")
  }
  await networkSync()
  const { mnemonic, password } = req.body
  try {
    const wallet = Wallet.fromMnemonic(mnemonic, {
      network,
      rpc,
    })
    const encryptedMnemonic = await wallet.export(password)
    wallet.sync(true)
    res.json({
      address: wallet.addressManager.getAddresses()[0].address,
      mnemonic: wallet.mnemonic,
      encryptedMnemonic: encryptedMnemonic,
      userPassword: password,
    })
  } catch (error) {
    console.log(error.toString())
    res.status(500).send({
      error: true,
      errorMessage: error.toString(),
      errorDesrciption: "Error message",
    })
  }
  return rpc.disconnect()
})

route.post("/send", async (req, res) => {
  if (!isApiKeyValid(req.body.apiKey)) {
    console.log("invalid apiKey")
    return res.status(401).send("unauthorized")
  }
  await networkSync()
  const { encryptedMnemonic, password, amount, fee, address } = req.body
  try {
    const wallet = await Wallet.import(password, encryptedMnemonic, {
      network,
      rpc,
    })
    // console.log(req.body)
    let response = await wallet.submitTransaction({
      toAddr: address, // destination address
      amount: Number(amount), // amount in base units
      fee: Number(fee), // user fees
    })
    console.log(response)
    if (!response || !response.txid) {
      res.status(500).send({
        error: true,
        errorMessage: error.toString(),
        errorDesrciption: "Error message",
      })
    }
  } catch (error) {
    console.log(error)
    res.status(500).send({
      error: true,
      errorMessage: error.toString(),
      errorDesrciption: "Error message",
    })
  }
  return rpc.disconnect()
})

route.post("/transactions", async (req, res) => {
  if (!isApiKeyValid(req.body.apiKey)) {
    console.log("invalid apiKey")
    return res.status(401).send("unauthorized")
  }
  const { encryptedMnemonic, password, address, amount, fee } = req.body
})

route.get("/*", async (req, res) => {
  return res.status(401).send("unauthorized")
})

export default route
