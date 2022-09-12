import useSWRImmutable from "swr/immutable"
import fetcher from "utils/fetcher"

const fetchCoin = (id: string) =>
  fetcher(
    `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=true&market_data=true&community_data=false&developer_data=false&sparkline=false`
  )

const useCoinById = (
  id: string
): { coinData: Record<string, any>; isCoinDataLoading: boolean } => {
  const { data: coinData, isValidating: isCoinDataLoading } = useSWRImmutable(
    id,
    fetchCoin
  )

  return { coinData, isCoinDataLoading }
}

export default useCoinById
