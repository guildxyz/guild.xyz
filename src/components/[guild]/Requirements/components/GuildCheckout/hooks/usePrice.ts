import { useWeb3React } from "@web3-react/core"
import useGuild from "components/[guild]/hooks/useGuild"
import { FetchPriceResponse } from "pages/api/fetchPrice"
import { useEffect, useState } from "react"
import useSWR, { SWRResponse } from "swr"
import { Requirement } from "types"
import fetcher from "utils/fetcher"
import {
  PURCHASABLE_REQUIREMENT_TYPES,
  purchaseSupportedChains,
} from "utils/guildCheckout/constants"
import { useGuildCheckoutContext } from "../components/GuildCheckoutContex"
import useShouldABTest from "./useShouldABTest"

const fetchPrice = (
  _: string,
  shouldABTest: boolean,
  guildId: number,
  account: string,
  requirement: Requirement,
  sellAddress: string
): Promise<FetchPriceResponse> =>
  fetcher(`/api/fetchPrice`, {
    method: "POST",
    body: {
      shouldABTest,
      guildId,
      account,
      ...requirement,
      sellToken: sellAddress,
    },
  })

const usePrice = (sellAddress?: string): SWRResponse<FetchPriceResponse> => {
  const { account } = useWeb3React()
  const { id } = useGuild()
  const { requirement, isOpen, pickedCurrency } = useGuildCheckoutContext()

  const [fallbackData, setFallbackData] = useState<FetchPriceResponse>()

  const shouldABTest = useShouldABTest()

  const shouldFetch =
    purchaseSupportedChains[requirement?.type]?.includes(requirement?.chain) &&
    isOpen &&
    PURCHASABLE_REQUIREMENT_TYPES.includes(requirement?.type) &&
    (sellAddress ?? pickedCurrency)

  const { data, ...swrResponse } = useSWR<FetchPriceResponse>(
    shouldFetch
      ? [
          "fetchPrice",
          shouldABTest,
          id,
          account,
          requirement,
          sellAddress ?? pickedCurrency,
        ]
      : null,
    fetchPrice,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
      refreshInterval: 30000,
    }
  )

  useEffect(() => {
    if (!data) return
    setFallbackData(data)
  }, [data])

  return {
    data: data ?? fallbackData ?? ({} as FetchPriceResponse),
    ...swrResponse,
  }
}

export default usePrice
