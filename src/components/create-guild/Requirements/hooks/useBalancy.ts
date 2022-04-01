import { parseUnits } from "@ethersproject/units"
import useDebouncedState from "hooks/useDebouncedState"
import { useEffect, useMemo, useState } from "react"
import { useWatch } from "react-hook-form"
import useSWR from "swr"
import fetcher from "utils/fetcher"

const fetchHolders = (_: string, logic: "OR" | "AND", requirements: any) =>
  fetcher(`${process.env.NEXT_PUBLIC_BALANCY_API}/xyzHolders`, {
    body: {
      logic,
      requirements,
      limit: 0,
    },
  }).then((data) => ({ ...data, usedLogic: logic }))

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

  const debouncedRequirements = useDebouncedState(requirements)
  const debouncedRequirement = useDebouncedState(requirement)

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

  const mappedRequirements = useMemo(
    () =>
      renderedRequirements
        ?.filter(
          ({ type, address, chain, data: { amount }, decimals }) =>
            address?.length > 0 &&
            BALANCY_SUPPORTED_TYPES[type] &&
            BALANCY_SUPPORTED_CHAINS[chain] &&
            (type !== "ERC20" || typeof decimals === "number") &&
            /^([0-9]+\.)?[0-9]+$/.test(amount)
        )
        ?.map(({ address, data: { amount }, type, decimals }) => {
          let balancyAmount = amount
          if (type === "ERC20") {
            try {
              const wei = parseUnits(amount.toString(), decimals).toString()
              balancyAmount = wei
            } catch {}
          }

          return {
            tokenAddress: address,
            amount: balancyAmount,
          }
        }) ?? [],
    [renderedRequirements]
  )

  const shouldFetch = !!balancyLogic && mappedRequirements?.length > 0

  const [holders, setHolders] = useState<BalancyResponse>(undefined)
  const { data, isValidating } = useSWR(
    shouldFetch
      ? ["balancy_holders", balancyLogic, mappedRequirements, index]
      : null,
    fetchHolders,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  )

  useEffect(() => {
    if (mappedRequirements.length <= 0) {
      setHolders(undefined)
    }
  }, [mappedRequirements])

  const allowlists = useMemo(
    () =>
      renderedRequirements
        ?.filter(({ type }) => type === "ALLOWLIST")
        ?.map(({ data: { addresses } }) => addresses) ?? [],
    [renderedRequirements]
  )

  useEffect(() => {
    if (!data) return
    if (index >= 0) {
      setHolders(data)
      return
    }

    if (balancyLogic === "OR") {
      setHolders({
        ...data,
        count: new Set([
          ...(data?.addresses ?? []),
          ...allowlists.filter((_) => !!_).flat(),
        ]).size,
      })
      return
    }
    setHolders({
      ...data,
      count: (data?.addresses ?? []).filter((address) =>
        allowlists.filter((_) => !!_).every((list) => list.includes(address))
      ).length,
    })
  }, [data, renderedRequirements])

  return {
    holders: holders?.count,
    usedLogic: holders?.usedLogic, // So we always display "at least", and "at most" according to the logic, we used to fetch holders
    isLoading: isValidating,
    inaccuracy:
      renderedRequirements.length - (mappedRequirements.length + allowlists.length), // Always non-negative
  }
}

export default useBalancy
