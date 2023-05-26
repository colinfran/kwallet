import express from "express"
import fs from "fs"
import fetch from "node-fetch"
import walletRoute from "./wallet/index.js"
import { getAppData } from "./functions/index.js"
import { isApiKeyValid } from "../functions/index.js"

import { fileURLToPath } from "url"
import path from "path"
import moment from "moment"
import nodemailer from "nodemailer"
import PublicGoogleSheetsParser from "public-google-sheets-parser"

let transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  secure: true,
  port: 465,
  auth: {
    user: "colin@kwallet.app",
    pass: process.env.EMAIL_PASSCODE,
  },
})

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const route = express.Router()

/**
 * @route GET /v1/data
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
    const { selectedCurrency, password, encryptedMnemonic } = req.body
    return res.json(
      await getAppData(selectedCurrency, password, encryptedMnemonic, res)
    )
  } catch (error) {
    console.log(error.toString())
    return res.status(500).send(error)
  }
})

/**
 * @route GET /v1/storage
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
 * @route GET /v1/logs
 * @desc return logs
 * @access Private
 * @returns {file} 200 -  the log file
 * @returns {Error}  500 - Unexpected error
 */
route.get("/logs", async (req, res) => {
  if (!isApiKeyValid(req.query.apiKey)) {
    return res.status(401).send("unauthorized")
  }
  try {
    return res.sendFile(path.join(__dirname, "../../default.log"))
  } catch (err) {
    console.log(err)
  }
})

/**
 * @route GET /v1/email-sign-up
 * @desc add signup email and date to google sheet and auto send email
 * @access Public
 * @returns {object} 200 - successfully added to google sheet and email sent
 * @returns {Error}  500 - Unexpected error
 */
route.post("/email-sign-up", async (req, res) => {
  const { email } = req.body
  const formData = new URLSearchParams({
    Email: email,
    Time: new Date().toISOString(),
  })
  const parser = new PublicGoogleSheetsParser(process.env.LIST_ID)
  const dataArray = await parser.parse()
  if (dataArray.some(e => e.Email === email)){
    return res.send({error: true, message: "User already signed up"})
  }
  
  try {
    const response = await fetch(process.env.EMAIL_LIST_URL, {
      method: "POST",
      body: formData,
    })
    const html = fs
      .readFileSync(path.join(__dirname, "/email-template.html"), "utf8")
      .toString()
    let result = html.replace("{{{REPLACE_WITH_DAY}}}", moment().format("dddd"))
    const mailOptions = {
      from: "colin@kwallet.app",
      to: email,
      subject: "Thanks for signing up for kwallet early access!",
      html: result,
    }
    console.log("Succesfull signup, sending welcome email to user.")
    await transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.log(err)
        res.status(401)
      } else {
        res.send(response)
      }
    })
  } catch (error) {
    res.status(401)
    console.log(error.toString())
  }
})

/**
 * @route GET /v1/wallet
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
