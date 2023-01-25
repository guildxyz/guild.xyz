import { FetchPriceResponse } from "pages/api/fetchPrice"
import { SWRResponse } from "swr"
import useSWRImmutable from "swr/immutable"
import { Requirement } from "types"
import fetcher from "utils/fetcher"
import { PURCHASABLE_REQUIREMENT_TYPES } from "utils/guildCheckout"
import { usePurchaseRequirementContext } from "../components/PurchaseRequirementContex"

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

const usePrice = (sellAddress: string): SWRResponse<FetchPriceResponse> => {
  const { requirement, isOpen } = usePurchaseRequirementContext()

  const shouldFetch =
    isOpen &&
    PURCHASABLE_REQUIREMENT_TYPES.includes(requirement?.type) &&
    sellAddress

  return useSWRImmutable<FetchPriceResponse>(
    shouldFetch ? ["fetchPrice", requirement, sellAddress] : null,
    fetchPrice
  )
}

export default usePrice
