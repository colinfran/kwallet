/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Wallet } from "@kaspa/wallet"

const network = "kaspa"
const { port } = Wallet.networkTypes[network].port

export { port, network }
