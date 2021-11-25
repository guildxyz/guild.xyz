import { RPC } from "connectors"
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

const fetchTokens = async (_: string, chain: string) =>
  fetch(TokenApiURLs[chain])
    .then((rawData) => rawData.json())
    .then((data) =>
      RPC[chain] ? [RPC[chain].nativeCurrency].concat(data.tokens) : data.tokens
    )

const useTokens = (chain: string) => {
  const { isValidating, data } = useSWRImmutable<Array<CoingeckoToken>>(
    chain ? ["tokens", chain] : null,
    fetchTokens
  )

  return { tokens: data, isLoading: isValidating }
}

export default useTokens
