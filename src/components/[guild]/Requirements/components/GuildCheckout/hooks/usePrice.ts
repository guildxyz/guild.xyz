import { FetchPriceResponse } from "pages/api/fetchPrice"
import { SWRResponse } from "swr"
import useSWRImmutable from "swr/immutable"
import { Requirement } from "types"
import fetcher from "utils/fetcher"
import {
  PURCHASABLE_REQUIREMENT_TYPES,
  purchaseSupportedChains,
} from "utils/guildCheckout"
import { useGuildCheckoutContext } from "../components/GuildCheckoutContex"

const fetchPrice = (
  _: string,
  requirement: Requirement,
  sellAddress: string
): Promise<FetchPriceResponse> =>
  fetcher(`/api/fetchPrice`, {
    method: "POST",
    body: {
      ...requirement,
      sellAddress,
    },
  })

const usePrice = (sellAddress?: string): SWRResponse<FetchPriceResponse> => {
  const { requirement, isOpen, pickedCurrency } = useGuildCheckoutContext()

  const shouldFetch =
    purchaseSupportedChains[requirement?.type]?.includes(requirement.chain) &&
    isOpen &&
    PURCHASABLE_REQUIREMENT_TYPES.includes(requirement?.type) &&
    (sellAddress ?? pickedCurrency)

  return useSWRImmutable<FetchPriceResponse>(
    shouldFetch ? ["fetchPrice", requirement, sellAddress ?? pickedCurrency] : null,
    fetchPrice,
    {
      shouldRetryOnError: false,
    }
  )
}

export default usePrice
