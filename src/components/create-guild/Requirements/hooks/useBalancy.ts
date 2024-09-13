import { env } from "env"
import useDebouncedState from "hooks/useDebouncedState"
import { useEffect, useMemo, useState } from "react"
import { useWatch } from "react-hook-form"
import useSWR from "swr"
import fetcher from "utils/fetcher"
import { parseUnits } from "viem"
import { Chain, Chains } from "wagmiConfig/chains"

type BalancyResponse = {
  addresses: string[]
  usedLogic: "OR" | "AND"
  count: number
}

type SupportedChain = "ETHEREUM" | "POLYGON" | "GNOSIS"

type BalancyRequirement = {
  chain: SupportedChain
  tokenAddress: string
  minAmount?: string
  maxAmount?: string
}

/** These are objects, so we can just index them when filtering requirements */
const BALANCY_SUPPORTED_TYPES: Record<
  "ERC20" | "ERC721" | "ERC1155" | "NOUNS",
  boolean
> = {
  ERC20: true,
  ERC721: true,
  ERC1155: true,
  NOUNS: true,
}
const BALANCY_SUPPORTED_CHAINS: Partial<Record<Chain, boolean>> = {
  ETHEREUM: true,
  POLYGON: true,
  GNOSIS: true,
}

const NUMBER_REGEX = /^([0-9]+\.)?[0-9]+$/

const fetchHolders = async ([_, logic, requirements]): Promise<BalancyResponse> => {
  const holdersArrays = await Promise.all(
    Object.keys(requirements).map((chain) =>
      fetcher(`${env.NEXT_PUBLIC_BALANCY_API}/xyzHolders?chain=${Chains[chain]}`, {
        body: {
          logic,
          requirements: requirements[chain],
          limit: 0,
        },
      }).then(({ addresses }) => addresses as string[])
    )
  )

  const finalAddressesList =
    logic === "OR"
      ? [...new Set(holdersArrays.flat(1))]
      : [
          ...holdersArrays
            .slice(1)
            .reduce(
              (acc, curr) => new Set(curr.filter((addr) => acc.has(addr))),
              new Set<string>(holdersArrays[0])
            ),
        ]

  return {
    addresses: finalAddressesList,
    usedLogic: logic,
    count: finalAddressesList?.length,
  }
}

/**
 * TODO: This hook is really messy with tons of useEffect, abstracted logic for
 * single and multiple requirements too and hacky solutions, should refactor
 */
const useBalancy = (
  baseFieldPath?: string
): {
  addresses: string[]
  holders: number
  usedLogic: "OR" | "AND"
  isLoading: boolean
  error: string
  inaccuracy: number
} => {
  const requirements = useWatch({ name: "requirements" })
  const requirement = useWatch({ name: baseFieldPath })
  const logic = useWatch({ name: "logic" })

  const debouncedRequirements = useDebouncedState(requirements)
  const debouncedRequirement = useDebouncedState(requirement)

  // Fixed logic for single requirement to avoid unnecessary refetch when changing logic
  const balancyLogic = baseFieldPath !== undefined ? "OR" : logic

  const renderedRequirements = useMemo<any[]>(
    () =>
      (baseFieldPath !== undefined
        ? debouncedRequirement
          ? [debouncedRequirement]
          : []
        : debouncedRequirements) ?? [],
    [debouncedRequirements, baseFieldPath, debouncedRequirement]
  )

  const mappedRequirements = useMemo(() => {
    const filteredRequirements =
      renderedRequirements
        ?.filter(
          ({ type, address, chain, data, balancyDecimals, isNegated }) =>
            !isNegated &&
            address?.length > 0 &&
            BALANCY_SUPPORTED_TYPES[type] &&
            BALANCY_SUPPORTED_CHAINS[chain] &&
            (type !== "ERC20" || typeof balancyDecimals === "number") &&
            NUMBER_REGEX.test(data?.minAmount?.toString()) &&
            data?.minAmount > 0
        )
        ?.map(
          ({
            chain,
            address,
            data: { minAmount, maxAmount },
            type,
            balancyDecimals,
          }) => {
            let balancyMinAmount = minAmount.toString()
            if (type === "ERC20") {
              try {
                const wei = parseUnits(balancyMinAmount, balancyDecimals).toString()
                balancyMinAmount = wei
              } catch {}
            }

            let balancyMaxAmount = maxAmount?.toString()

            if (NUMBER_REGEX.test(balancyMaxAmount)) {
              if (type === "ERC20") {
                try {
                  const wei = parseUnits(
                    balancyMaxAmount,
                    balancyDecimals
                  ).toString()
                  balancyMaxAmount = wei
                } catch {}
              }
            }

            return {
              chain: chain as SupportedChain,
              tokenAddress: address,
              minAmount: balancyMinAmount,
              maxAmount: balancyMaxAmount,
            } as BalancyRequirement
          }
        ) ?? []

    const obj: Record<SupportedChain | string, BalancyRequirement[]> = {}

    filteredRequirements?.forEach((req) => {
      if (!obj[req.chain]) obj[req.chain] = []

      obj[req.chain].push(req)
    })

    return obj
  }, [renderedRequirements])

  const shouldFetch = !!balancyLogic && Object.keys(mappedRequirements)?.length > 0

  const [holders, setHolders] = useState<BalancyResponse>(undefined)
  const { data, isValidating, error } = useSWR(
    shouldFetch ? ["balancy_holders", balancyLogic, mappedRequirements] : null,
    fetchHolders,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  )

  useEffect(() => {
    if (Object.keys(mappedRequirements).length <= 0) {
      setHolders(undefined)
    }
  }, [mappedRequirements])

  const allowlists = useMemo(
    () =>
      renderedRequirements
        ?.filter(({ type, isNegated }) => type === "ALLOWLIST" && !isNegated)
        ?.map(({ data: { addresses } }) =>
          addresses?.map((addr) => addr.toLowerCase())
        ) ?? [],
    [renderedRequirements]
  )

  useEffect(() => {
    if (!data) return
    if (baseFieldPath !== undefined) {
      setHolders(data)
      return
    }

    if (balancyLogic === "OR") {
      const holdersList = new Set([
        ...(data?.addresses?.map((addr) => addr?.toLowerCase()) ?? []),
        ...allowlists.filter((_) => !!_).flat(),
      ])

      setHolders({
        ...data,
        count: holdersList.size,
        addresses: Array.from(holdersList),
      })
      return
    }

    const holdersList = (
      data?.addresses?.map((addr) => addr?.toLowerCase()) ?? []
    ).filter((address) =>
      allowlists.filter((_) => !!_).every((list) => list.includes(address))
    )

    setHolders({
      ...data,
      count: holdersList.length,
      addresses: holdersList,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, renderedRequirements])

  const mappedRequirementsLength = Object.values(mappedRequirements).reduce(
    (acc, curr) => acc + curr.length,
    0
  )

  const addresses =
    holders?.addresses ??
    (!!baseFieldPath
      ? requirement?.data?.validAddresses
      : logic === "OR"
        ? [
            ...new Set(
              allowlists
                ?.flat()
                ?.filter(Boolean)
                ?.map((addr) => addr.toLowerCase())
            ),
          ]
        : [
            ...allowlists?.reduce(
              (prev, curr) =>
                new Set(
                  curr?.filter((addr) => !!addr && prev.has(addr.toLowerCase())) ??
                    []
                ),
              new Set(
                allowlists?.[0]?.filter(Boolean)?.map((addr) => addr.toLowerCase())
              )
            ),
          ])

  return {
    addresses,
    holders: addresses?.length || (!!data ? 0 : undefined),
    usedLogic: holders?.usedLogic, // So we always display "at least", and "at most" according to the logic, we used to fetch holders
    isLoading: isValidating,
    error,
    inaccuracy:
      renderedRequirements.length - (mappedRequirementsLength + allowlists.length), // Always non-negative
  }
}

export { BALANCY_SUPPORTED_CHAINS }
export default useBalancy
