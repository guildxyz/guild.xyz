import useSWRImmutable from "swr/immutable"
import { CoingeckoToken } from "temporaryData/types"

const ETHER = {
  chainId: 1,
  address: "ETHER", // needed for proper form handling in the TokenFormCard component
  name: "Ether",
  symbol: "ETH",
  decimals: 18,
  logoURI:
    "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
}

const fetchTokensList = async () =>
  fetch("https://tokens.coingecko.com/uniswap/all.json")
    .then((rawData) => rawData.json())
    .then((data) => [ETHER].concat(data.tokens))

const useTokensList = (): CoingeckoToken[] => {
  const { data } = useSWRImmutable("tokensList", fetchTokensList)

  return data
}

export default useTokensList
