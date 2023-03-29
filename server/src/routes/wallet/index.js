import express from "express"
const route = express.Router()
import { Wallet, network, rpc } from "../../kaspa/index.js"

/**
 * @route POST /api/wallet/create
 * @desc get newly created Kaspa wallet data
 * @access Private
 * @returns {object} 200 - newly created Kaspa wallet data
 * @returns {Error}  500 - Unexpected error
 */
route.post("/create", async (req, res) => {
  const { password } = req.body
  try {
    const wallet = new Wallet(null, null, { network, rpc })
    const encryptedMnemonic = await wallet.export(password)
    res.json({
      address: wallet.addressManager.getAddresses()[0].address,
      mnemonic: wallet.mnemonic,
      encryptedMnemonic: encryptedMnemonic,
      userPassword: password,
    })
  } catch (error) {
    console.log(error)
    res.json({
      error: true,
      errorMessage: error,
      errorDesrciption: "Error message",
    })
  }
})

/**
 * @route POST /api/wallet/import
 * @desc get imported Kaspa wallet data
 * @access Private
 * @returns {object} 200 - imported Kaspa wallet data
 * @returns {Error}  500 - Unexpected error
 */
route.post("/import", async (req, res) => {
  const { mnemonic, password } = req.body
  try {
    const encryptedMnemonic = Wallet.Crypto.encrypt(mnemonic)
    const wallet = await Wallet.import(password, encryptedMnemonic, {
      network,
      rpc,
    })
    return res.json({
      address: wallet.addressManager.getAddresses()[0].address,
      mnemonic: wallet.mnemonic,
      encryptedMnemonic: encryptedMnemonic,
      userPassword: password,
    })
  } catch (error) {
    return res.json({
      error: true,
      errorMessage: error,
      errorDesrciption: "Error message",
    })
  }
})

export default route
