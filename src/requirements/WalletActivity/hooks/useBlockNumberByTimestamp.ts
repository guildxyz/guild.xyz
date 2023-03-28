import { Chain, RPC } from "connectors"
import { SWRResponse } from "swr"
import useSWRImmutable from "swr/immutable"

const useBlockNumberByTimestamp = (
  chain: Chain,
  timestamp: number
): SWRResponse<number> => {
  const shouldFetch = chain && timestamp

  const swrResponse = useSWRImmutable(
    shouldFetch
      ? `${RPC[chain].apiUrl}/api?module=block&action=getblocknobytime&timestamp=${timestamp}&closest=before`
      : null
  )

  return {
    ...swrResponse,
    data: swrResponse?.data?.result ? parseInt(swrResponse.data.result) : undefined,
    error:
      swrResponse?.data && swrResponse.data.status !== "1"
        ? "Rate limited, please try again later"
        : swrResponse?.error,
  }
}

export default useBlockNumberByTimestamp
