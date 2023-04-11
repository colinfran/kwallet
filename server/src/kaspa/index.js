/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Wallet, initKaspaFramework } from "@kaspa/wallet"
// import { RPC } from "@kaspa/grpc-node"

/* Initialize Kaspa Node Framework*/
const network = "kaspa"
const { port } = Wallet.networkTypes[network].port

;(async () => {
  await initKaspaFramework()
})()

export { Wallet, port, network }
