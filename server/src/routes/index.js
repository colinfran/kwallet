import express from "express"
import { fileURLToPath } from "url"
import path from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const route = express.Router()

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
