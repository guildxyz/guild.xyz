import { InjectedConnector } from "@web3-react/injected-connector"

enum Chains {
  ETHEREUM = 1,
  ROPSTEN = 3,
  GOERLI = 5,
  BSC = 56,
  BSCTEST = 97,
  POLYGON = 137,
}

const RPC = {
  POLYGON: {
    chainId: "0x89",
    chainName: "Matic",
    nativeCurrency: {
      name: "Polygon",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: ["https://rpc-mainnet.maticvigil.com/"],
    blockExplorerUrls: ["https://polygonscan.com/"],
    // iconUrls: string[] // Currently ignored.
  },
  ETHEREUM: {
    chainName: "Ethereum",
    blockExplorerUrls: ["https://etherscan.io/"],
    // iconUrls: string[] // Currently ignored.
  },
  GOERLI: {
    chainName: "Goerli",
    blockExplorerUrls: ["https://goerli.etherscan.io/"],
    // iconUrls: string[] // Currently ignored.
  },
  BSC: {
    chainId: "0x38",
    chainName: "BSC",
    nativeCurrency: {
      name: "Binance Coin",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: ["https://bsc-dataseed.binance.org/"],
    blockExplorerUrls: ["https://bscscan.com/"],
    // iconUrls: string[] // Currently ignored.
  },
}

const supportedChains = ["POLYGON", "BSC", "GOERLI", "ETHEREUM"]
const supportedChainIds = supportedChains.map((_) => Chains[_])

const injected = new InjectedConnector({ supportedChainIds })

export { Chains, RPC, supportedChains }
export default injected
