import { Chains, RPC } from "connectors"
import useSWRImmutable from "swr/immutable"
import { CoingeckoToken } from "types"
import fetcher from "utils/fetcher"

export const TokenApiURLs = {
  ETHEREUM: ["https://tokens.coingecko.com/uniswap/all.json"],
  BSC: ["https://tokens.coingecko.com/binance-smart-chain/all.json"],
  GNOSIS: [
    "https://unpkg.com/@1hive/default-token-list@5.17.1/build/honeyswap-default.tokenlist.json",
  ],
  POLYGON: [
    "https://unpkg.com/quickswap-default-token-list@1.0.91/build/quickswap-default.tokenlist.json",
  ],
  AVALANCHE: ["https://tokens.coingecko.com/avalanche/all.json"],
  FANTOM: ["https://tokens.coingecko.com/fantom/all.json"],
  ARBITRUM: ["https://tokens.coingecko.com/arbitrum-one/all.json"],
  NOVA: ["https://tokens.coingecko.com/arbitrum-nova/all.json"],
  CELO: [
    "https://raw.githubusercontent.com/Ubeswap/default-token-list/master/ubeswap.token-list.json",
  ],
  HARMONY: [
    "https://raw.githubusercontent.com/DefiKingdoms/community-token-list/main/src/defikingdoms-default.tokenlist.json",
    "https://raw.githubusercontent.com/DefiKingdoms/community-token-list/main/build/defikingdoms-community.tokenlist.json",
  ],
  GOERLI: [
    "https://raw.githubusercontent.com/Uniswap/default-token-list/main/src/tokens/goerli.json",
  ],
  OPTIMISM: ["https://static.optimism.io/optimism.tokenlist.json"],
  MOONRIVER: ["https://tokens.coingecko.com/moonriver/all.json"],
  MOONBEAM: ["https://tokens.coingecko.com/moonbeam/all.json"],
  METIS: ["https://tokens.coingecko.com/metis-andromeda/all.json"],
  CRONOS: ["https://tokens.coingecko.com/cronos/all.json"],
  BOBA: ["https://tokens.coingecko.com/boba/all.json"],
  BOBA_AVAX: ["https://tokens.coingecko.com/boba/all.json"],
  PALM: [],
}

const fetchTokens = async (_: string, chain: string) => {
  if (chain === "GOERLI")
    return [
      {
        chainId: 5,
        address: "0x0000000000000000000000000000000000000000",
        name: "Matic",
        symbol: "MATIC",
        decimals: 18,
        logoURI:
          "https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png?1624446912",
      },
      {
        chainId: 5,
        address: "0x07865c6e87b9f70255377e024ace6630c1eaa37f",
        name: "USD Coin",
        symbol: "USDC",
        decimals: 6,
        logoURI:
          "https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png?1547042389",
      },
      {
        chainId: 5,
        address: "0x73967c6a0904aa032c103b4104747e88c566b1a2",
        name: "Dai",
        symbol: "DAI",
        decimals: 18,
        logoURI:
          "https://assets.coingecko.com/coins/images/9956/thumb/4943.png?1636636734",
      },
      {
        chainId: 5,
        address: "0x509ee0d083ddf8ac028f2a56731412edd63223b9",
        name: "Tether",
        symbol: "USDT",
        decimals: 6,
        logoURI:
          "https://assets.coingecko.com/coins/images/325/thumb/Tether.png?1668148663",
      },
    ]

  return Promise.all(TokenApiURLs[chain].map((url) => fetcher(url))).then(
    (tokenArrays: any) => {
      const finalTokenArray = tokenArrays.reduce(
        (acc, curr) =>
          acc.concat(
            (Array.isArray(curr) ? curr : curr?.tokens)?.filter(
              ({ chainId }) => chainId === Chains[chain]
            )
          ),
        []
      )
      return RPC[chain]
        ? [RPC[chain].nativeCurrency].concat(finalTokenArray)
        : finalTokenArray
    }
  )
}

const useTokens = (chain: string) => {
  const { isValidating, data } = useSWRImmutable<Array<CoingeckoToken>>(
    chain ? ["tokens", chain] : null,
    fetchTokens
  )

  return { tokens: data, isLoading: isValidating }
}

export default useTokens
