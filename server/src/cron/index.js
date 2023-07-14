/* eslint-disable @typescript-eslint/explicit-function-return-type */
import cron from "node-cron"
import {
  updateData,
  updateCurrentPrice,
  sleep,
  getAppStatus,
} from "./functions/index.js"

/* 
  Coingecko graciously provides a free public api in which we pull our 
  data from. This server periodically refreshes its local database with 
  Coingecko's Kaspa data.

  International currencies supported: 
  -usd
  -euro
  -japanese yen
  -british pound
  -chinese yuan
  -australian dollar
  -canadian dollar
  -swiss franc
*/
const supportedCurrencies = [
  "usd",
  "eur",
  "jpy",
  "gbp",
  "cny",
  "aud",
  "cad",
  "chf",
]

const initializeCronJobs = () => {
  // run every 8 minutes - currentPrice
  cron.schedule("*/8 * * * *", () => {
    const run = async () => {
      await getAppStatus()
      for (const currency of supportedCurrencies) {
        await updateCurrentPrice(currency)
        await sleep(20)
      }
    }
    run()
  })

  // run every 15 minutes - 1D
  cron.schedule("*/15 * * * *", () => {
    const run = async () => {
      await sleep(23)
      for (const currency of supportedCurrencies) {
        await updateData("1D", currency, 23)
        await sleep(20)
      }
    }
    run()
  })

  // run every 30 minutes - 1W
  cron.schedule("*/30 * * * *", () => {
    const run = async () => {
      await sleep(33)
      for (const currency of supportedCurrencies) {
        await updateData("1W", currency, 33)
        await sleep(20)
      }
    }
    run()
  })

  // run every hour - 1M
  cron.schedule("0 * * * *", async () => {
    const run = async () => {
      await sleep(121)
      for (const currency of supportedCurrencies) {
        await updateData("1M", currency, 47)
        await sleep(20)
      }
    }
    run()
  })

  // run every 2 hours - 1Y
  cron.schedule("0 */2 * * *", async () => {
    const run = async () => {
      await sleep(77)
      for (const currency of supportedCurrencies) {
        await updateData("1Y", currency, 63)
        await sleep(20)
      }
    }
    run()
  })

  // run every 3 hours - ALL
  cron.schedule("0 */3 * * *", async () => {
    const run = async () => {
      await sleep(99)
      for (const currency of supportedCurrencies) {
        await updateData("ALL", currency, 73)
        await sleep(20)
      }
    }
    run()
  })
}

export { initializeCronJobs }
