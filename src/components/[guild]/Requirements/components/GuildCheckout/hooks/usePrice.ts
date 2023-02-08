import { useWeb3React } from "@web3-react/core"
import { FetchPriceResponse } from "pages/api/fetchPrice"
import { SWRResponse } from "swr"
import useSWRImmutable from "swr/immutable"
import { Requirement } from "types"
import fetcher from "utils/fetcher"
import {
  PURCHASABLE_REQUIREMENT_TYPES,
  purchaseSupportedChains,
} from "utils/guildCheckout/constants"
import { useGuildCheckoutContext } from "../components/GuildCheckoutContex"

const fetchPrice = (
  _: string,
  account: string,
  requirement: Requirement,
  buyAddress: string
): Promise<FetchPriceResponse> =>
  fetcher(`/api/fetchPrice`, {
    method: "POST",
    body: {
      account,
      ...requirement,
      buyToken: buyAddress,
    },
  })

const usePrice = (buyAddress?: string): SWRResponse<FetchPriceResponse> => {
  const { account } = useWeb3React()
  const { requirement, isOpen, pickedCurrency } = useGuildCheckoutContext()

  const shouldFetch =
    account &&
    purchaseSupportedChains[requirement?.type]?.includes(requirement?.chain) &&
    isOpen &&
    PURCHASABLE_REQUIREMENT_TYPES.includes(requirement?.type) &&
    (buyAddress ?? pickedCurrency)

  const { data, ...swrResponse } = useSWRImmutable<FetchPriceResponse>(
    shouldFetch
      ? ["fetchPrice", account, requirement, buyAddress ?? pickedCurrency]
      : null,
    fetchPrice,
    {
      shouldRetryOnError: false,
    }
  )

  return {
    data: data ?? ({} as FetchPriceResponse),
    ...swrResponse,
  }
}

export default usePrice
