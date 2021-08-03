import { InjectedConnector } from "@web3-react/injected-connector"

enum Chains {
  ethereum = 1,
  ropsten = 3,
  bsc = 56,
  bsctest = 97,
  polygon = 137,
}

const RPC = {
  polygon: {
    chainId: "0x89",
    chainName: "Matic Mainnet",
    nativeCurrency: {
      name: "Polygon",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: ["https://rpc-mainnet.maticvigil.com/"],
    blockExplorerUrls: ["https://polygonscan.com/"],
    // iconUrls: string[] // Currently ignored.
  },
}

const injected = new InjectedConnector({
  supportedChainIds: [Chains.polygon, Chains.bsc, Chains.ethereum],
})

export { Chains, RPC }
export default injected
