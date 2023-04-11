/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Wallet, initKaspaFramework } from "@kaspa/wallet"

/* Initialize Kaspa Node Framework*/
const initializeKaspa = async () => {
  await initKaspaFramework()
}

const network = "kaspa"
const { port } = Wallet.networkTypes[network].port
initializeKaspa()
// rpc.connect()

export { Wallet, network, port }
