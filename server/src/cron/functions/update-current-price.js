/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import fetch from "node-fetch"
import { db } from "../../database/index.js"
import log from "log-to-file"

const sleep = async (seconds) => {
  await new Promise((resolve) => setTimeout(resolve, seconds * 1000))
}

export const updateCurrentPrice = async (selectedCurrency) => {
  try {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=kaspa&vs_currencies=${selectedCurrency}`
    log(`Fetching data from - ${url}`)
    const response = await fetch(url)
    const { kaspa } = await response.json()
    if (kaspa !== undefined) {
      log("Successful fetch. Adding data to db.")
      await db.set(
        `${selectedCurrency} -- currentPrice`,
        kaspa[selectedCurrency]
      )
    } else {
      const str = `There was an issue getting the currentPrice in ${selectedCurrency}.`
      log(str)
      console.log(str)
    }
  } catch (error) {
    log(error.toString())
    console.log(error.toString())
  }
  sleep(17)
}
