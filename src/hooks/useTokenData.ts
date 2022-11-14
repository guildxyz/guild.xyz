import { useMemo } from "react"
import useSWRImmutable from "swr/immutable"
import { Token } from "types"
import useTokens from "./useTokens"

const ENS_ADDRESS = "0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85"

const useTokenData = (
  chain: string,
  address: string,
  options?: {
    onFinish?: () => void
    skipFetch?: boolean
  }
) => {
  const { tokens, isLoading } = useTokens(chain)

  const tokenDataFromApi = useMemo(() => {
    if (!address || !tokens) return null

    const lowerCaseAddress = address.toLowerCase()
    if (lowerCaseAddress === ENS_ADDRESS)
      return { name: "ENS", symbol: "ENS", decimals: undefined, logoURI: undefined }
    return tokens?.find((token) => token.address?.toLowerCase() === lowerCaseAddress)
  }, [tokens, address])

  const shouldFetch =
    !options?.skipFetch &&
    !isLoading &&
    !tokenDataFromApi &&
    /^0x[A-F0-9]{40}$/i.test(address) &&
    chain &&
    address !== "0x0000000000000000000000000000000000000000"

  const swrResponse = useSWRImmutable<Token>(
    shouldFetch ? `/util/symbol/${address}/${chain}` : null,
    {
      errorRetryInterval: 100,
      shouldRetryOnError: address?.toLowerCase() !== ENS_ADDRESS,
      ...(options?.onFinish
        ? { onSuccess: options?.onFinish, onError: options?.onFinish }
        : {}),
    }
  )

  /**
   * Doing this instead of using initialData to make sure it fetches when shouldFetch
   * becomes true
   */
  const name = tokenDataFromApi?.name ?? swrResponse.data?.name
  const symbol = swrResponse.data?.symbol ?? tokenDataFromApi?.symbol
  const decimals = tokenDataFromApi?.decimals ?? swrResponse.data?.decimals

  return {
    ...swrResponse,
    error: swrResponse.error || (name === "-" && symbol === "-"),
    data: {
      name,
      symbol: symbol && symbol !== "-" ? symbol : name,
      decimals,
      logoURI: tokenDataFromApi?.logoURI,
    },
  }
}

export default useTokenData
