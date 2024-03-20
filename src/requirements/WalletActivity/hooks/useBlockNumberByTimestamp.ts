import { Chain } from "chains"
import { SWRResponse } from "swr"
import useSWRImmutable from "swr/immutable"
import { getBlockByTime } from "utils/getBlockByTime"

const useBlockNumberByTimestamp = (
  chain: Chain,
  timestamp: number
): SWRResponse<number> => {
  const shouldFetch = chain && timestamp

  const swrResponse = useSWRImmutable(
    shouldFetch ? ["getBlockByTime", chain, timestamp] : null,
    getBlockByTime,
    {
      shouldRetryOnError: true,
      errorRetryCount: 3,
    }
  )

  return {
    ...swrResponse,
    data: swrResponse?.data?.result ? parseInt(swrResponse.data.result) : undefined,
  }
}

export default useBlockNumberByTimestamp
