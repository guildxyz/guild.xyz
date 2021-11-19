import useSWRImmutable from "swr/immutable"
import { CoingeckoToken } from "temporaryData/types"

enum TokenApiURLs {
  ETHEREUM = "https://tokens.coingecko.com/uniswap/all.json",
  BSC = "https://tokens.pancakeswap.finance/pancakeswap-extended.json",
  XDAI = "https://unpkg.com/@1hive/default-token-list@5.17.1/build/honeyswap-default.tokenlist.json",
  POLYGON = "https://unpkg.com/quickswap-default-token-list@1.0.91/build/quickswap-default.tokenlist.json",
  AVALANCHE = "https://raw.githubusercontent.com/traderjoe-xyz/joe-tokenlists/main/joe.tokenlist.json",
  FANTOM = "https://raw.githubusercontent.com/Crocoswap/tokenlists/main/aeb.tokenlist.json",
  ARBITRUM = "https://bridge.arbitrum.io/token-list-42161.json",
}

const CHAINTOKENS = {
  ETHEREUM: {
    chainId: 1,
    address: "COIN", // needed for proper form handling in the TokenFormCard component
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
    logoURI:
      "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
  },
  BSC: {
    chainId: 56,
    address: "COIN",
    name: "Binance Coin",
    symbol: "BNB",
    decimals: 18,
    logoURI:
      "https://assets.coingecko.com/coins/images/825/small/binance-coin-logo.png?1547034615",
  },
  XDAI: {
    chainId: 100,
    address: "COIN",
    name: "xDAI",
    symbol: "XDAI",
    decimals: 18,
    logoURI:
      "https://assets.coingecko.com/coins/images/11062/small/xdai.png?1614727492",
  },
  POLYGON: {
    chainId: 137,
    address: "COIN",
    name: "Matic",
    symbol: "MATIC",
    decimals: 18,
    logoURI:
      "https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png?1624446912",
  },
  AVALANCHE: {
    chainId: 43114,
    address: "COIN",
    name: "AVAX",
    symbol: "AVAX",
    decimals: 18,
    logoURI:
      "https://assets.coingecko.com/coins/images/12559/small/coin-round-red.png?1604021818",
  },
  FANTOM: {
    chainId: 250,
    address: "COIN",
    name: "Fantom",
    symbol: "FTM",
    decimals: 18,
    logoURI:
      "https://assets.coingecko.com/coins/images/4001/small/Fantom.png?1558015016",
  },
  // ARBITRUM: {
  //   chainId: 1,
  //   address: "COIN",
  //   name: "Ether",
  //   symbol: "ETH",
  //   decimals: 18,
  //   logoURI:
  //     "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
  // },
}

const fetchTokens = async (_: string, chain: string) =>
  fetch(TokenApiURLs[chain])
    .then((rawData) => rawData.json())
    .then((data) =>
      CHAINTOKENS[chain] ? [CHAINTOKENS[chain]].concat(data.tokens) : data.tokens
    )

const useTokens = (
  chain: string
): { tokens: Array<CoingeckoToken>; isLoading: boolean } => {
  const { isValidating, data } = useSWRImmutable(["tokens", chain], fetchTokens)

  return { tokens: data, isLoading: isValidating }
}

export default useTokens
