import express from "express"
const route = express.Router()

/**
 * @route POST /api/wallet/create
 * @desc get newly created Kaspa wallet data
 * @access Private
 * @returns {object} 200 - newly created Kaspa wallet data
 * @returns {Error}  500 - Unexpected error
 */
route.get("/", async (req, res) => {
  return res.json({ test: true })
})

route.get("/*", async (req, res) => {
  return res.status(401).send("unauthorized")
})

export default route
