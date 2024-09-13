import { useMemo } from "react"
import useSWRImmutable from "swr/immutable"
import { Token } from "types"
import { CHAIN_CONFIG, Chain } from "wagmiConfig/chains"
import useTokens from "./useTokens"

const ENS_ADDRESS = "0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85"

const useTokenData = (chain: Chain, address: string, onFinish?: () => void) => {
  const isCoin =
    address === CHAIN_CONFIG[chain]?.nativeCurrency?.symbol ||
    address === "0x0000000000000000000000000000000000000000"

  const shouldFetch = /^0x[A-F0-9]{40}$/i.test(address) && !!chain && !isCoin

  const tokensFromApi = useTokens(chain)

  const tokenDataFromApi = useMemo(() => {
    if (!address || !tokensFromApi) return null

    const lowerCaseAddress = address.toLowerCase()
    if (lowerCaseAddress === ENS_ADDRESS)
      return { name: "ENS", symbol: "ENS", decimals: undefined, logoURI: undefined }
    return tokensFromApi.tokens?.find(
      (token) => token?.address?.toLowerCase() === lowerCaseAddress
    )
  }, [tokensFromApi, address])

  const swrResponse = useSWRImmutable<Token>(
    shouldFetch ? `/v2/util/chains/${chain}/contracts/${address}/symbol` : null,
    {
      errorRetryInterval: 100,
      shouldRetryOnError: address?.toLowerCase() !== ENS_ADDRESS,
      ...(onFinish ? { onSuccess: onFinish, onError: onFinish } : {}),
    }
  )

  /**
   * Doing this instead of using initialData to make sure it fetches when shouldFetch
   * becomes true
   */
  const name =
    isCoin && chain
      ? CHAIN_CONFIG[chain].nativeCurrency.name
      : (tokenDataFromApi?.name ?? swrResponse.data?.name)
  const symbol =
    isCoin && chain
      ? CHAIN_CONFIG[chain].nativeCurrency.symbol
      : (swrResponse.data?.symbol ?? tokenDataFromApi?.symbol)
  const decimals =
    isCoin && chain
      ? CHAIN_CONFIG[chain].nativeCurrency.decimals
      : (tokenDataFromApi?.decimals ?? swrResponse.data?.decimals)
  const logoURI =
    isCoin && chain ? CHAIN_CONFIG[chain].iconUrl : tokenDataFromApi?.logoURI

  return {
    ...swrResponse,
    error: swrResponse.error || (name === "-" && symbol === "-"),
    data: {
      name,
      symbol: symbol && symbol !== "-" ? symbol : name,
      decimals,
      logoURI,
    },
  }
}

export default useTokenData
