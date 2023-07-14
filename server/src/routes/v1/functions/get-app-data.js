/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { db } from "../../../database/index.js"
import { network, rpc } from "../../../kaspa/index.js"
import { Wallet } from "@kaspa/wallet"

export const getAppData = async (
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
  const appStatus = JSON.parse(await db.get("appStatus"))

  let wallet = null
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
    wallet.setLogLevel("debug")
    let w_address = wallet.receiveAddress
    console.log("address", w_address)
    console.log("address-test", wallet.addressManager.receiveAddress.current.address)
  } catch (err) {
    console.log(
      "Failed opening wallet. There was an issue. A possible reason for this error is that incorrect wallet information was sent."
    )
    res.status(500).send(err)
  }
  console.log("")
  console.log("network:", wallet.network)
  console.log("blue score:", wallet.blueScore)
  console.log("---")
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
      balance: 0,
    },
  }
}
