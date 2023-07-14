/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import moment from "moment"
import fetch from "node-fetch"
import { db } from "../../database/index.js"
import log from "log-to-file"

const validJson = (str) => {
  try {
    JSON.parse(str)
  } catch (e) {
    return true
  }
  return false
}

const isNotHTML = (str) => {
  return !/(<([^>]+)>)/.test(str)
}

const updateGraphData = async (timestamp, currency) => {
  let timeValue = moment()
  switch (timestamp) {
    case "1W":
      timeValue = moment().subtract(1, "weeks").unix()
      break
    case "1M":
      timeValue = moment().subtract(1, "months").unix()
      break
    case "1Y":
      timeValue = moment().subtract(1, "years").unix()
      break
    case "ALL":
      timeValue = moment("2022-05-01").unix()
      break
    default:
      // 1D
      timeValue = moment().subtract(1, "days").unix()
      break
  }

  try {
    // eslint-disable-next-line max-len
    const url = `https://api.coingecko.com/api/v3/coins/kaspa/market_chart/range?vs_currency=${currency}&from=${timeValue}&to=${moment().unix()}`
    log(`Fetching data from - ${url}`)
    const response = await fetch(url)
    const { prices, status } = await response.json()
    if (status || prices === undefined || prices.length === 0) {
      return ["failed"]
    }
    let fixedPrices = []
    for (var i = 0; i < prices.length; i++) {
      const item = prices[i]
      fixedPrices.push({ x: item[0], y: item[1] })
    }
    return fixedPrices
  } catch (error) {
    log("An error occured when trying to fetch data.")
    log(error)
    console.log("An error occured when trying to fetch data.")
    console.log(error.toString())
    return ["failed"]
  }
}

export const sleep = async (seconds) => {
  await new Promise((resolve) => setTimeout(resolve, seconds * 1000))
}

export const updateData = async (timestamp, currency, sleepTime = 0) => {
  const data = await updateGraphData(timestamp, currency)
  try {
    if (data[0] !== "failed" && validJson(data) && isNotHTML(data)) {
      log("Successful fetch. Adding data to db.")
      await db.set(`${currency} -- ${timestamp}`, JSON.stringify(data))
    } else {
      log(
        `There was an issue getting the graph data for '${timestamp}' in ${currency}.`
      )
      console.log(
        `There was an issue getting the graph data for '${timestamp}' in ${currency}.`
      )
    }
  } catch (err) {
    log(err)
    console.log(err)
  }
  await sleep(sleepTime)
}
