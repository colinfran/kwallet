/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import moment from "moment"
import fetch from "node-fetch"
import { db } from "../database/index.js"
import log from "log-to-file"
import { Wallet, network, port } from "../kaspa/index.js"
import { RPC } from "@kaspa/grpc-node"

export const sleep = async (seconds) => {
  await new Promise((resolve) => setTimeout(resolve, seconds * 1000))
}

export const updateData = async (timestamp, currency, sleepTime = 0) => {
  const data = await getGraphData(timestamp, currency)
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
    return json
  } catch (error) {
    log(error)
    console.log(error.toString())
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

const getGraphData = async (timestamp, currency) => {
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
      fixedPrices.push({ timestamp: item[0], value: item[1] })
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

export const updateCurrentPrice = async (selectedCurrency) => {
  try {
    // eslint-disable-next-line max-len
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

const isNotHTML = (str) => {
  return !/(<([^>]+)>)/.test(str)
}

const getDuration = (ts) => {
  if (!ts) return "--:--:--"
  let delta = Math.round(ts / 1000)
  let sec_ = delta % 60
  let min_ = Math.floor((delta / 60) % 60)
  let hrs_ = Math.floor((delta / 60 / 60) % 24)
  let days = Math.floor(delta / 60 / 60 / 24)

  let sec = (sec_ < 10 ? "0" : "") + sec_
  let min = (min_ < 10 ? "0" : "") + min_
  let hrs = (hrs_ < 10 ? "0" : "") + hrs_

  if (days && days >= 1) {
    return `${days.toFixed(0)} day${
      days > 1 ? "s" : ""
    } ${hrs}h ${min}m ${sec}s`
  } else {
    let t = ""
    if (hrs_) t += hrs + "h "
    if (hrs_ || min_) {
      t += min + "m "
      t += sec + "s "
    } else {
      t += sec_.toFixed(1) + " seconds"
    }
    return t
  }
}

const networkSync = (res, rpc) => {
  return new Promise(async (resolve, reject) => {
    const nsTs0 = Date.now()
    console.log(`sync ... starting network sync`)
    try {
      await rpc.connect()
    } catch (ex) {
      console.log(ex.toString())
      return res.status(500).send(ex)
    }
    const nsDelta = Date.now() - nsTs0
    console.log(
      `sync ... finished (network sync done in ${getDuration(nsDelta)})`
    )
    resolve()
  })
}

export const getLineGraphData = async (
  selectedCurrency,
  password,
  encryptedMnemonic,
  res
) => {
  const data1Y = JSON.parse(await db.get(`${selectedCurrency} -- 1Y`))
  const data1M = JSON.parse(await db.get(`${selectedCurrency} -- 1M`))
  const data1W = JSON.parse(await db.get(`${selectedCurrency} -- 1W`))
  const data1D = JSON.parse(await db.get(`${selectedCurrency} -- 1D`))
  const dataALL = JSON.parse(await db.get(`${selectedCurrency} -- ALL`))

  const currentPrice = JSON.parse(
    await db.get(`${selectedCurrency} -- currentPrice`)
  )
  const appStatus = await getAppStatus()

  let wallet = null
  let rpc = new RPC({ clientConfig: { host: "127.0.0.1:" + port } })

  try {
    wallet = await Wallet.import(
      password,
      encryptedMnemonic,
      {
        network,
        rpc,
      },
      { disableAddressDerivation: true, syncOnce: true }
    )
    await networkSync(res, rpc)
    console.log(wallet.receiveAddress)
    console.log("Syncing wallet.")
    await wallet.sync(true)
    console.log("Wallet sync finished.")
  } catch (err) {
    console.log(
      "Failed opening wallet. There was an issue. A possible reason for this error is that incorrect wallet information was sent."
    )
    res.status(500).send(err)
  }
  const walletBalance = wallet.balance
  console.log(walletBalance)
  console.log("")
  console.log("network:", wallet.network.yellow)
  console.log("blue score:", wallet.blueScore.cyan)
  console.log("---")
  console.log(
    "current receive address:",
    wallet.addressManager.receiveAddress.current.address.green
  )
  rpc.disconnect()
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
