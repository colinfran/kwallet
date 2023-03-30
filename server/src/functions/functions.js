/* eslint-disable @typescript-eslint/explicit-function-return-type */
import moment from "moment"
import fetch from "node-fetch"
import { db } from "../database/index.js"

export const isApiKeyValid = (key) => {
  const apiList = JSON.parse(process.env.API_LIST)
  return apiList.includes(key)
}

export const getAppStatus = async () => {
  try {
    const response = await fetch(
      `https://raw.githubusercontent.com/colinfran/kwallet/main/alerts.json`
    )
    const json = await response.json()
    await db.set("appStatus", JSON.stringify(json))
  } catch (error) {
    console.log(error)
  }
}

const validJson = (str) => {
  try {
    JSON.parse(str)
  } catch (e) {
    return true
  }
  return false
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
    return []
  }
}

const isNotHTML = (str) => {
  return !/(<([^>]+)>)/.test(str)
}

const sleep = async (seconds) => {
  await new Promise((resolve) => setTimeout(resolve, seconds * 1000))
}

export const triggerDataRefresh = async () => {
  const dataALL = await getGraphData("ALL")
  try {
    if (dataALL[0] !== "failed" && validJson(dataALL) && isNotHTML(dataALL)) {
      await db.set("dataALL", JSON.stringify(dataALL))
    } else {
      console.log("There was an issue getting the data for graph data all")
    }
  } catch (err) {
    console.log(err)
  }
  await sleep(120)
  const data1D = await getGraphData("1D")
  try {
    if (data1D[0] !== "failed" && validJson(data1D) && isNotHTML(data1D)) {
      await db.set("data1D", JSON.stringify(data1D))
    } else {
      console.log("There was an issue getting the data for graph data 1d")
    }
  } catch (err) {
    console.log(err)
  }
  await sleep(120)
  const data1Y = await getGraphData("1Y")
  try {
    if (data1Y[0] !== "failed" && validJson(data1Y) && isNotHTML(data1Y)) {
      await db.set("data1Y", JSON.stringify(data1Y))
    } else {
      console.log("There was an issue getting the data for graph data 1y")
    }
  } catch (err) {
    console.log(err)
  }
  await sleep(120)
  const data1M = await getGraphData("1M")
  try {
    if (data1M[0] !== "failed" && validJson(data1M) && isNotHTML(data1M)) {
      await db.set("data1M", JSON.stringify(data1M))
    } else {
      console.log("There was an issue getting the data for graph data 1m")
    }
  } catch (err) {
    console.log(err)
  }
  await sleep(120)
  const data1W = await getGraphData("1W")
  try {
    if (data1W[0] !== "failed" && validJson(data1W) && isNotHTML(data1W)) {
      await db.set("data1W", JSON.stringify(data1W))
    } else {
      console.log("There was an issue getting the data for graph data 1w")
    }
  } catch (err) {
    console.log(err)
  }

  await sleep(120)
  const val = await getCurrentPrice()
  try {
    if (val !== "failed" && String(val) === val && isNotHTML(val)) {
      await db.set("currentPrice", val)
    } else {
      console.log("There was an issue getting the data for current price")
    }
  } catch (err) {
    console.log(err)
  }
}

export const getData = async (wallet) => {
  const data1Y = JSON.parse(await db.get("data1Y"))
  const data1M = JSON.parse(await db.get("data1M"))
  const data1W = JSON.parse(await db.get("data1W"))
  const data1D = JSON.parse(await db.get("data1D"))
  const dataALL = JSON.parse(await db.get("dataALL"))

  const currentPrice = JSON.parse(await db.get("currentPrice"))

  const appStatus = JSON.parse(await db.get("appStatus"))

  wallet.sync(true)
  const walletBalance = await wallet.balance

  return {
    appStatus: appStatus,
    currentPrice: `${currentPrice}`,
    day: {
      prices: data1D,
    },
    week: {
      prices: data1W,
    },
    month: {
      prices: data1M,
    },
    year: {
      prices: data1Y,
    },
    all: {
      prices: dataALL,
    },
    walletData: {
      balance: walletBalance,
    },
  }
}
