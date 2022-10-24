import { useEffect, useState } from "react"
import useSWR, { SWRResponse } from "swr"
import useTokens from "./useTokens"

const ENS_ADDRESS = "0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85"

type TokenData = {
  name: string
  symbol: string
  decimals?: number
}

const useTokenData = (chain: string, address: string): SWRResponse<TokenData> => {
  const shouldFetch = /^0x[A-F0-9]{40}$/i.test(address) && chain

  const tokensFromApi = useTokens(chain)

  const [tokenDataFromApi, setTokenDataFromApi] = useState<TokenData>()

  useEffect(() => {
    if (!address || !tokensFromApi) return

    const lowerCaseAddress = address.toLowerCase()
    if (lowerCaseAddress === ENS_ADDRESS) {
      setTokenDataFromApi({ name: "ENS", symbol: "ENS", decimals: undefined })
      return
    }

    setTokenDataFromApi(
      tokensFromApi.tokens?.find(
        (token) => token.address?.toLowerCase() === lowerCaseAddress
      )
    )
  }, [tokensFromApi, address])

  const swrResponse = useSWR<{ name: string; symbol: string; decimals: number }>(
    shouldFetch ? `/util/symbol/${address}/${chain}` : null,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      errorRetryInterval: 100,
      shouldRetryOnError: address?.toLowerCase() !== ENS_ADDRESS,
    }
  )

  return {
    ...swrResponse,
    /**
     * Doing this instead of using initialData to make sure it fetches when
     * shouldFetch becomes true
     */
    data: tokenDataFromApi
      ? {
          name: tokenDataFromApi?.name,
          symbol: tokenDataFromApi?.symbol,
          decimals: tokenDataFromApi?.decimals,
        }
      : swrResponse.data ?? {
          name: undefined,
          symbol: undefined,
          decimals: undefined,
        },
  }
}

export default useTokenData
