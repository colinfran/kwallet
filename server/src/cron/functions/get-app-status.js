/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import fetch from "node-fetch"
import { db } from "../../database/index.js"
import log from "log-to-file"

export const getAppStatus = async () => {
  const url = `https://raw.githubusercontent.com/colinfran/kwallet/main/alerts.json`
  log(`Fetching app status from ${url}`)
  try {
    const response = await fetch(url)
    const json = await response.json()
    await db.set("appStatus", JSON.stringify(json))
    return json
  } catch (error) {
    log(error)
    console.log(error.toString())
  }
}
