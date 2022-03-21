import { useEffect, useMemo, useState } from "react"
import { useWatch } from "react-hook-form"
import useSWR from "swr"
import fetcher from "utils/fetcher"

const LIMIT_PER_REQUEST = 10_000

const fetchERC20Holders = async (
  _: string,
  logic: "AND" | "OR",
  requirements: any,
  fetchAddresses: boolean
) => {
  const response = await fetcher("/api/balancy/xyzHolders", {
    body: { logic, requirements, limit: 1 },
  })
  if (!fetchAddresses) return response
  const numOfRequests = Math.ceil(response.count / LIMIT_PER_REQUEST)

  return Promise.all(
    [...new Array(numOfRequests)].map((_, i) =>
      fetcher("/api/balancy/xyzHolders", {
        body: {
          logic,
          requirements,
          limit: LIMIT_PER_REQUEST,
          offset: i * LIMIT_PER_REQUEST,
        },
      })
    )
  ).then((bodies) => ({
    ...response,
    addresses: bodies.flatMap((body) => body.addresses),
  }))
}

type BalancyResponse = {
  addresses: string[]
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

  const hasAllowlist = useMemo(
    () =>
      typeof index === "number"
        ? false
        : renderedRequirements.some(({ type }) => type === "ALLOWLIST"),
    [renderedRequirements, index]
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

  const shouldFetch =
    (typeof index === "number" || logic === "AND" || logic === "OR") &&
    mappedRequirements?.length > 0

  const [holders, setHolders] = useState<BalancyResponse>(undefined)
  const { data, isValidating } = useSWR(
    shouldFetch
      ? ["ERC20Holders", logic, mappedRequirements, hasAllowlist, index]
      : null,
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

  const countWithAllowlist = useMemo(() => {
    if (
      !hasAllowlist ||
      typeof index === "number" ||
      (logic !== "OR" && logic !== "AND")
    )
      return holders?.count
    const allowlists =
      renderedRequirements
        ?.filter(({ type }) => type === "ALLOWLIST")
        ?.map(({ data: { addresses } }) => addresses)
        ?.filter((_) => !!_) ?? []

    if (logic === "OR") {
      return new Set([...(holders?.addresses ?? []), ...allowlists.flat()]).size
    }
    return (holders?.addresses ?? []).filter((address) =>
      allowlists.every((list) => list.includes(address))
    ).length
  }, [hasAllowlist, holders, renderedRequirements, logic, index])

  return {
    holders: shouldFetch ? countWithAllowlist : undefined,
    isLoading: isValidating,
    isInaccurate: unsupportedChains.length > 0 || unsupportedTypes.length > 0,
    unsupportedTypes,
    unsupportedChains,
  }
}

export default useBalancy
