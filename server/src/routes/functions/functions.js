/* eslint-disable @typescript-eslint/explicit-function-return-type */
import moment from "moment"
import fetch from "node-fetch"
import change from "percent-change"
import { db } from "../../database/index.js"

const isJson = (str) => {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}

const getGraphData = async (timestamp) => {
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
    const url = `https://api.coingecko.com/api/v3/coins/kaspa/market_chart/range?vs_currency=usd&from=${timeValue}&to=${moment().unix()}`
    console.log(url)
    const response = await fetch(url)
    const { prices, status } = await response.json()
    if (status || prices === undefined || prices.length === 0) {
      return ["failed"]
    }
    let fixedPrices = []
    for (var i = 0; i < prices.length; i++) {
      const item = prices[i]
      fixedPrices.push({ timestamp: item[0], value: item[1] })
    }
    return fixedPrices
  } catch (error) {
    console.log(error)
    console.error(error)
    return ["failed"]
  }
}

const getCurrentPrice = async () => {
  try {
    // eslint-disable-next-line max-len
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=kaspa&vs_currencies=usd`
    console.log(url)
    const response = await fetch(url)
    const { kaspa } = await response.json()
    if (kaspa === undefined) {
      return "failed"
    }
    return kaspa.usd
  } catch (error) {
    console.log(error)
    console.error(error)
    return []
  }
}

var isHTML = RegExp.prototype.test.bind(/(<([^>]+)>)/i);


const sleep = async (seconds) => {
  await new Promise((resolve) => setTimeout(resolve, seconds * 1000))
}

export const triggerDataRefresh = async () => {
  const dataALL = await getGraphData("ALL")
  try {
    if (dataALL[0] === "failed" || !isJson(dataALL) || isHTML(dataALL)) {
      console.log("There was an issue getting the data for graph data all")
    } else await db.set("dataALL", JSON.stringify(dataALL))
  } catch (err) {
    console.error(err)
    console.log(err)
  }
  await sleep(120)
  const data1D = await getGraphData("1D")
  try {
    if (data1D[0] === "failed" || !isJson(data1D) || isHTML(data1D)) {
      console.log("There was an issue getting the data for graph data 1d")
    } else await db.set("data1D", JSON.stringify(data1D))
  } catch (err) {
    console.error(err)
    console.log(err)
  }
  await sleep(120)
  const data1Y = await getGraphData("1Y")
  try {
    if (data1Y[0] === "failed" || !isJson(data1Y) || isHTML(data1Y)) {
      console.log("There was an issue getting the data for graph data 1y")
    } else await db.set("data1Y", JSON.stringify(data1Y))
  } catch (err) {
    console.error(err)
    console.log(err)
  }
  await sleep(120)
  const data1M = await getGraphData("1M")
  try {
    if (data1M[0] === "failed" || !isJson(data1M) || isHTML(data1M)) {
      console.log("There was an issue getting the data for graph data 1m")
    } else await db.set("data1M", JSON.stringify(data1M))
  } catch (err) {
    console.error(err)
    console.log(err)
  }
  await sleep(120)
  const data1W = await getGraphData("1W")
  try {
    if (data1W[0] === "failed" || !isJson(data1W) || isHTML(data1W)) {
      console.log("There was an issue getting the data for graph data 1w")
    } else await db.set("data1W", JSON.stringify(data1W))
  } catch (err) {
    console.error(err)
    console.log(err)
  }

  await sleep(120)
  const val = await getCurrentPrice()
  try {
    if (val === "failed" || String(val) !== val || isHTML(val)) {
      console.log("There was an issue getting the data for current price")
    } else await db.set("currentPrice", val)
  } catch (err) {
    console.error(err)
    console.log(err)
  }
}

export const getData = async (wallet) => {
  const data1Y = JSON.parse(await db.get("data1Y"))
  const data1M = JSON.parse(await db.get("data1M"))
  const data1W = JSON.parse(await db.get("data1W"))
  const data1D = JSON.parse(await db.get("data1D"))
  const dataALL = JSON.parse(await db.get("dataALL"))

  const dataALLPercent = JSON.parse(await db.get("dataALL-highlow"))
  const data1YPercent = JSON.parse(await db.get("data1Y-highlow"))
  const data1MPercent = JSON.parse(await db.get("data1M-highlow"))
  const data1WPercent = JSON.parse(await db.get("data1W-highlow"))
  const data1DPercent = JSON.parse(await db.get("data1D-highlow"))

  const currentPrice = JSON.parse(await db.get("currentPrice"))

  const dayChange = change(data1DPercent[0][1], currentPrice, false)
  const weekChange = change(data1WPercent[0][1], currentPrice, false)
  const monthChange = change(data1MPercent[0][1], currentPrice, false)
  const yearChange = change(data1YPercent[0][1], currentPrice, false)
  const allChange = change(dataALLPercent[0][1], currentPrice, false)

  wallet.sync(true)

  return {
    currentPrice: `${currentPrice}`,
    day: {
      percent_change: dayChange,
      prices: data1D,
    },
    week: {
      percent_change: weekChange,
      prices: data1W,
    },
    month: {
      percent_change: monthChange,
      prices: data1M,
    },
    year: {
      percent_change: yearChange,
      prices: data1Y,
    },
    all: {
      percent_change: allChange,
      prices: dataALL,
    },
    walletData: {
      balance: await wallet.balance,
    },
  }
}
