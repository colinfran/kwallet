/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Wallet, initKaspaFramework } from "@kaspa/wallet"
import { RPC } from "@kaspa/grpc-node"

/* Initialize Kaspa Node Framework*/
const initializeKaspa = async () => {
  await initKaspaFramework()
}

const network = "kaspa"
const { port } = Wallet.networkTypes[network].port
const rpc = new RPC({ clientConfig: { host: "127.0.0.1:" + port } })

export { Wallet, network, rpc, initializeKaspa }
