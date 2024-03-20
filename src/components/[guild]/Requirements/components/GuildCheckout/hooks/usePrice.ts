import useGuild from "components/[guild]/hooks/useGuild"
import { FetchPriceResponse } from "pages/api/fetchPrice"
import useSWR, { SWRResponse } from "swr"
import fetcher from "utils/fetcher"
import {
  NULL_ADDRESS,
  PURCHASABLE_REQUIREMENT_TYPES,
  purchaseSupportedChains,
} from "utils/guildCheckout/constants"
import { useAccount } from "wagmi"
import { CHAIN_CONFIG } from "wagmiConfig/chains"
import { useRequirementContext } from "../../RequirementContext"
import { useGuildCheckoutContext } from "../components/GuildCheckoutContext"

const fetchPrice = ([, guildId, , requirement, sellAddress]): Promise<
  FetchPriceResponse<bigint>
> => {
  const queryParams = new URLSearchParams({
    guildId,
    minAmount: requirement.data.minAmount,
    address: requirement.address,
    type: requirement.type,
    chain: requirement.chain,
    sellToken: sellAddress,
  }).toString()
  return fetcher(`/api/fetchPrice?${queryParams}`).then((data) => ({
    ...data,
    buyAmountInWei: BigInt(data.buyAmountInWei),
    maxPriceInWei: BigInt(data.maxPriceInWei),
    estimatedGuildFeeInWei: BigInt(data.estimatedGuildFeeInWei),
    maxGuildFeeInWei: BigInt(data.maxGuildFeeInWei),
  }))
}

const usePrice = (sellAddress?: string): SWRResponse<FetchPriceResponse<bigint>> => {
  const { address } = useAccount()
  const { id } = useGuild()

  const requirement = useRequirementContext()
  const { isOpen, pickedCurrency } = useGuildCheckoutContext()

  const sellAddressOrPickedCurrency = sellAddress ?? pickedCurrency

  const shouldFetch =
    purchaseSupportedChains[requirement?.type]?.includes(requirement?.chain) &&
    isOpen &&
    PURCHASABLE_REQUIREMENT_TYPES.includes(requirement?.type) &&
    sellAddressOrPickedCurrency

  const { data, ...swrResponse } = useSWR<FetchPriceResponse<bigint>>(
    shouldFetch
      ? [
          "fetchPrice",
          id,
          address,
          requirement,
          sellAddressOrPickedCurrency === NULL_ADDRESS
            ? CHAIN_CONFIG[requirement.chain].nativeCurrency.symbol
            : sellAddressOrPickedCurrency,
        ]
      : null,
    fetchPrice,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
      refreshInterval: 30000,
      keepPreviousData: true,
    }
  )

  return {
    data: data ?? ({} as FetchPriceResponse<bigint>),
    ...swrResponse,
  }
}

export default usePrice
