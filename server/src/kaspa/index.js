/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Wallet, initKaspaFramework } from "@kaspa/wallet"
// import { RPC } from "@kaspa/grpc-node"

/* Initialize Kaspa Node Framework*/
let rpc
const network = "kaspa"
const { port } = Wallet.networkTypes[network].port

const initializeKaspa = async () => {
  await initKaspaFramework()
  // rpc = new RPC({ clientConfig: { host: "127.0.0.1:" + port } })
}

export { Wallet, port, network, initializeKaspa }
