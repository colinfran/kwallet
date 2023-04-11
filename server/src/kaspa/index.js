/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Wallet, initKaspaFramework } from "@kaspa/wallet"
import { RPC } from "@kaspa/grpc-node"

/* Initialize Kaspa Node Framework*/
const initializeKaspa = async () => {
  await initKaspaFramework()
}

const network = "kaspa"
const { port } = Wallet.networkTypes[network].port
initializeKaspa()
const rpc = new RPC({ clientConfig: { host: "127.0.0.1:" + port } })

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

const networkSync = () => {
  return new Promise(async (resolve, reject) => {
    const nsTs0 = Date.now()
    console.log(`sync ... starting network sync`)
    try {
      await rpc.connect()
    } catch (ex) {
      console.log(ex.toString())
      process.exit(1)
    }
    const nsDelta = Date.now() - nsTs0
    console.log(
      `sync ... finished (network sync done in ${getDuration(nsDelta)})`
    )
    resolve()
  })
}

export { Wallet, network, port, networkSync, rpc }
