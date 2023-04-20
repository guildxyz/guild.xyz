import { Chain, RPC } from "connectors"
import { SWRResponse } from "swr"
import useSWRImmutable from "swr/immutable"
import fetcher from "utils/fetcher"

const getBlockByTime = (_: string, chain: Chain, timestamp: number) =>
  fetcher(
    `${RPC[chain].apiUrl}/api?module=block&action=getblocknobytime&timestamp=${timestamp}&closest=before`
  ).then((json) => {
    if (json.status !== "1")
      throw new Error("Rate limited, will try again in 5 seconds")

    return json
  })

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
