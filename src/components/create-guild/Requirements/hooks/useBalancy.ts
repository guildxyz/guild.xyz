import { useMemo, useState } from "react"
import { useWatch } from "react-hook-form"
import useSWR from "swr"
import fetcher from "utils/fetcher"

const fetchERC20Holders = (
  _: string,
  logic: "AND" | "OR",
  requirements: any,
  limit: number
) =>
  fetcher("/api/balancy/erc20/xyzHolders", {
    body: { logic, requirements, limit },
  })

type BalancyResponse = {
  result: string[]
  pagination: {
    count: number
    limit: number
    offset: number
  }
}

/**
 * These are objects, so we can just index them to check for support, when filtering
 * requirements. If they were array, we would have to iterate them every time (with
 * .includes())
 *
 * Right now it doesn't make a difference, as there is only one item in them
 */
const BALANCY_SUPPORTED_TYPES = {
  ERC20: true,
}
const BALANCY_SUPPORTED_CHAINS = {
  ETHEREUM: true,
}

const useBalancy = () => {
  const requirements = useWatch({ name: "requirements" })
  const logic = useWatch({ name: "logic" })

  const renderedRequirements = useMemo(
    () => requirements?.filter(({ type }) => type !== null) ?? [],
    [requirements]
  )

  const unsupportedTypes = useMemo(
    () => [
      ...new Set(
        renderedRequirements
          .map(({ type }) => type)
          .filter((type) => !BALANCY_SUPPORTED_TYPES[type])
      ),
    ],
    [renderedRequirements]
  )
  const unsupportedChains = useMemo(
    () => [
      ...new Set(
        renderedRequirements
          .map(({ chain }) => chain)
          .filter((chain) => !BALANCY_SUPPORTED_CHAINS[chain])
      ),
    ],
    [renderedRequirements]
  )

  const filteredRequirements = useMemo(
    () =>
      requirements?.filter(
        ({ type, address, chain, data: { amount } }) =>
          address?.length > 0 &&
          BALANCY_SUPPORTED_TYPES[type] &&
          BALANCY_SUPPORTED_CHAINS[chain] &&
          /^[0-9]+$/.test(amount)
      ) ?? [],
    [requirements]
  )

  const mappedRequirements = useMemo(
    () =>
      filteredRequirements.map(({ address, data: { amount } }) => ({
        token: address,
        amount,
      })),
    [filteredRequirements]
  )

  const shouldFetch = !!logic && mappedRequirements?.length > 0

  const [holders, setHolders] = useState<BalancyResponse>(undefined)
  const { isValidating } = useSWR(
    shouldFetch ? ["ERC20Holders", logic, mappedRequirements, 1] : null,
    fetchERC20Holders,
    {
      fallbackData: holders,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      onSuccess: setHolders,
    }
  )

  return {
    holders: holders?.pagination?.count,
    isLoading: isValidating,
    isInaccurate: unsupportedChains.length > 0 || unsupportedTypes.length > 0,
    unsupportedTypes,
    unsupportedChains,
  }
}

export default useBalancy
