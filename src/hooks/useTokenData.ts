import useSWR from "swr"
import fetchApi from "utils/fetchApi"
import { CHAINTOKENS } from "./useTokens"

const ENS_ADDRESS = "0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85"

const getTokenData = (_: string, chain: string, address: string) =>
  fetchApi(`/guild/symbol/${address}/${chain}`)

const useTokenData = (chain: string, address: string) => {
  const shouldFetch = /^0x[A-F0-9]{40}$/i.test(address)

  const swrResponse = useSWR<{ name: string; symbol: string }>(
    shouldFetch ? ["tokenData", chain, address] : null,
    getTokenData,
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
    data:
      (address === "COIN" && {
        name: CHAINTOKENS[chain]?.name,
        symbol: CHAINTOKENS[chain]?.symbol,
      }) ||
      (address?.toLowerCase() === ENS_ADDRESS && { name: "ENS", symbol: "ENS" }) ||
      (swrResponse.data ?? { name: undefined, symbol: undefined }),
  }
}

export default useTokenData
