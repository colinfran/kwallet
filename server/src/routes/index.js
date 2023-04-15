import express from "express"
import { fileURLToPath } from "url"
import path from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const route = express.Router()

const privacy = ["/privacy", "/privacy.html"]
const terms = ["/terms", "/terms.html"]
const index = ["/", "/index", "index.html"]

/**
 * @route GET root webpages
 * @desc get root webpages
 * @access Public
 * @returns {object} 200 - graph data and data associated with wallet
 * @returns {Error}  500 - Unexpected error
 */
route.get([...privacy, ...terms, ...index], async (req, res) => {
  if (terms.includes(req.originalUrl)) {
    res.sendFile(path.join(__dirname + "/../public/terms.html"))
  } else if (privacy.includes(req.originalUrl)) {
    res.sendFile(path.join(__dirname + "/../public/privacy.html"))
  } else {
    res.sendFile(path.join(__dirname + "/../public/index.html"))
  }
})

/**
 * @route GET url shortener for analytics
 * @desc url shortener for analytics
 * @access Public
 * @returns {object} 200 - redirects to homepage with analytics
 * @returns {Error}  500 - Unexpected error
 */
route.get("/k/:id", (req, res) => {
  const { id } = req.params
  const val = id.split("+")
  let source = val[0]
  let medium = val[0]
  if (val.length > 1) {
    medium = val[1]
  }
  // console.log(`https://kwallet.app/?utm_source=${source}&utm_medium=${medium}`)
  res.redirect(
    // eslint-disable-next-line max-len
    `https://kwallet.app/?utm_source=${source}&utm_medium=${medium}`
  )
})

route.get("/*", async (req, res) => {
  return res.status(401).send("unauthorized")
})

export default route
