import { Wallet, initKaspaFramework, kaspacore } from "@kaspa/wallet"
import { RPC } from "@kaspa/grpc-node"

/* Initialize Kaspa Node Framework*/
await initKaspaFramework()
const network = "kaspatest"
const { port } = Wallet.networkTypes[network].port
const rpc = new RPC({ clientConfig: { host: "127.0.0.1:" + port } })

export { Wallet, network, rpc }
