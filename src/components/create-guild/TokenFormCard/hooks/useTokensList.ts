import useSWR from "swr"
import { CoingeckoToken } from "temporaryData/types"

const fetchTokensList = async () =>
  fetch("https://tokens.coingecko.com/uniswap/all.json")
    .then((rawData) => rawData.json())
    .then((data) => data.tokens)

const useTokensList = (): CoingeckoToken[] => {
  const { data } = useSWR("tokensList", fetchTokensList, {
    revalidateOnFocus: false,
  })

  return data
}

export default useTokensList
