import useCoinById from "./useCoinById"

const useFeeInUSD = (
  fee: number,
  coingeckoId: string
): { feeInUSD: number; isFeeInUSDLoading: boolean } => {
  const { coinData, isCoinDataLoading } = useCoinById(coingeckoId)

  const coinUSDPrice = coinData?.market_data?.current_price?.usd

  return {
    // @ts-expect-error TODO: fix this error originating from strictNullChecks
    feeInUSD: fee && coinUSDPrice ? fee * coinUSDPrice : undefined,
    isFeeInUSDLoading: isCoinDataLoading,
  }
}

export default useFeeInUSD
