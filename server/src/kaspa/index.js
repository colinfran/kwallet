/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Wallet } from "@kaspa/wallet"
import { RPC } from "@kaspa/grpc-node"

const network = "kaspa"
const { port } = Wallet.networkTypes[network].port
let rpc = new RPC({ clientConfig: { host: "127.0.0.1:" + port } })

export { port, network, rpc }
