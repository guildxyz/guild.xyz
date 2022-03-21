import { useEffect, useMemo, useState } from "react"
import { useWatch } from "react-hook-form"
import useSWR from "swr"
import fetcher from "utils/fetcher"

const fetchERC20Holders = (
  _: string,
  logic: "AND" | "OR",
  requirements: any,
  limit: number
) =>
  fetcher("/api/balancy/xyzHolders", {
    body: { logic, requirements, limit },
  })

type BalancyResponse = {
  result: string[]
  count: number
  limit: number
  offset: number
}

/** These are objects, so we can just index them when filtering requirements */
const BALANCY_SUPPORTED_TYPES = {
  ERC20: true,
  ERC721: true,
  ERC1155: true,
}
const BALANCY_SUPPORTED_CHAINS = {
  ETHEREUM: true,
}

const useBalancy = (index?: number) => {
  const requirements = useWatch({ name: "requirements" })
  const requirement = useWatch({ name: `requirements.${index}` })
  const logic = useWatch({ name: "logic" })

  const renderedRequirements = useMemo(
    () =>
      (typeof index === "number" ? [requirement] : requirements)?.filter(
        ({ type }) => type !== null
      ) ?? [],
    [requirements, index, requirement]
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
      renderedRequirements?.filter(
        ({ type, address, chain, data: { amount } }) =>
          address?.length > 0 &&
          BALANCY_SUPPORTED_TYPES[type] &&
          BALANCY_SUPPORTED_CHAINS[chain] &&
          /^[0-9]+$/.test(amount)
      ) ?? [],
    [renderedRequirements]
  )

  const mappedRequirements = useMemo(
    () =>
      filteredRequirements.map(({ address, data: { amount } }) => ({
        tokenAddress: address,
        amount,
      })),
    [filteredRequirements]
  )

  const shouldFetch = !!logic && mappedRequirements?.length > 0

  const [holders, setHolders] = useState<BalancyResponse>(undefined)
  const { data, isValidating } = useSWR(
    shouldFetch ? ["ERC20Holders", logic, mappedRequirements, 1, index] : null,
    fetchERC20Holders,
    {
      fallbackData: holders,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  )

  useEffect(() => setHolders(data), [data])

  useEffect(() => {
    if (mappedRequirements.length <= 0) {
      setHolders(undefined)
    }
  }, [mappedRequirements])

  return {
    holders: holders?.count,
    isLoading: isValidating,
    isInaccurate: unsupportedChains.length > 0 || unsupportedTypes.length > 0,
    unsupportedTypes,
    unsupportedChains,
  }
}

export default useBalancy
