import useDebouncedState from "hooks/useDebouncedState"
import { useEffect, useMemo, useState } from "react"
import { useWatch } from "react-hook-form"
import useSWR from "swr"
import fetcher from "utils/fetcher"

const DEBOUNCE_TIMEOUT_MS = 1500

const fetchHolders = (_: string, logic: "OR" | "AND", requirements: any) =>
  fetcher("/api/balancy/xyzHolders", {
    body: {
      logic,
      requirements,
      limit: 0,
    },
  }).then((data) => ({ ...data, logic }))

type BalancyResponse = {
  addresses: string[]
  count: number
  limit: number
  offset: number
  usedLogic: "OR" | "AND"
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

const useBalancy = (index = -1) => {
  const requirements = useWatch({ name: "requirements" })
  const requirement = useWatch({ name: `requirements.${index}` })
  const logic = useWatch({ name: "logic" })

  const debouncedRequirements = useDebouncedState(requirements, DEBOUNCE_TIMEOUT_MS)
  const debouncedRequirement = useDebouncedState(requirement, DEBOUNCE_TIMEOUT_MS)

  // Fixed logic for single requirement to avoid unnecessary refetch when changing logic
  const balancyLogic =
    index >= 0
      ? "OR"
      : logic === "NAND" || logic === "NOR"
      ? logic.substring(1)
      : logic

  const renderedRequirements = useMemo(
    () =>
      (index >= 0 ? [debouncedRequirement] : debouncedRequirements)?.filter(
        ({ type }) => type !== null
      ) ?? [],
    [debouncedRequirements, index, debouncedRequirement]
  )

  const unsupportedTypes = useMemo(
    () => [
      ...new Set(
        renderedRequirements
          .map(({ type }) => type)
          .filter((type) => !BALANCY_SUPPORTED_TYPES[type] && type !== "ALLOWLIST")
      ),
    ],
    [renderedRequirements]
  )
  const unsupportedChains = useMemo(
    () => [
      ...new Set(
        renderedRequirements
          .map(({ chain }) => chain)
          .filter((chain) => chain && !BALANCY_SUPPORTED_CHAINS[chain])
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

  const shouldFetch = !!balancyLogic && mappedRequirements?.length > 0

  const [holders, setHolders] = useState<BalancyResponse>(undefined)
  const { data, isValidating } = useSWR(
    shouldFetch
      ? ["balancy_holders", balancyLogic, mappedRequirements, index]
      : null,
    fetchHolders,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  )

  useEffect(() => {
    if (mappedRequirements.length <= 0) {
      setHolders(undefined)
    }
  }, [mappedRequirements])

  useEffect(() => {
    if (!data) return
    if (index >= 0) {
      setHolders(data)
      return
    }
    const allowlists =
      renderedRequirements
        ?.filter(({ type }) => type === "ALLOWLIST")
        ?.map(({ data: { addresses } }) => addresses)
        ?.filter((_) => !!_) ?? []

    if (balancyLogic === "OR") {
      setHolders({
        ...data,
        count: new Set([...(data?.addresses ?? []), ...allowlists.flat()]).size,
      })
      return
    }
    setHolders({
      ...data,
      count: (data?.addresses ?? []).filter((address) =>
        allowlists.every((list) => list.includes(address))
      ).length,
    })
  }, [data, renderedRequirements])

  return {
    holders: holders?.count,
    usedLogic: holders?.usedLogic, // So we always display "at least", and "at most" according to the logic, we used to fetch holders
    isLoading: isValidating,
    isInaccurate: unsupportedChains.length > 0 || unsupportedTypes.length > 0,
    unsupportedTypes,
    unsupportedChains,
  }
}

export default useBalancy
