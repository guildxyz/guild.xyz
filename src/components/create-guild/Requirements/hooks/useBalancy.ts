import { BigNumber } from "@ethersproject/bignumber"
import { parseUnits } from "@ethersproject/units"
import { Chains } from "connectors"
import useDebouncedState from "hooks/useDebouncedState"
import { useEffect, useMemo, useState } from "react"
import { useWatch } from "react-hook-form"
import useSWR from "swr"
import { Requirement } from "types"
import fetcher from "utils/fetcher"

type BalancyResponse = {
  addresses: string[]
  usedLogic: "OR" | "AND"
  count: number
}

type SupportedChain = "ETHEREUM" | "POLYGON" | "GNOSIS"

type BalancyRequirement = {
  chain: SupportedChain
  tokenAddress: string
  amount: BigNumber
}

/** These are objects, so we can just index them when filtering requirements */
const BALANCY_SUPPORTED_TYPES = {
  ERC20: true,
  ERC721: true,
  ERC1155: true,
  NOUNS: true,
}
const BALANCY_SUPPORTED_CHAINS = {
  ETHEREUM: true,
  POLYGON: true,
  GNOSIS: true,
}

const NUMBER_REGEX = /^([0-9]+\.)?[0-9]+$/

const fetchHolders = async (
  _: string,
  logic: "OR" | "AND",
  requirements: Record<SupportedChain, BalancyRequirement[]>
): Promise<BalancyResponse> => {
  const holdersArrays = await Promise.all(
    Object.keys(requirements).map((chain) =>
      fetcher(
        `${process.env.NEXT_PUBLIC_BALANCY_API}/xyzHolders?chain=${Chains[chain]}`,
        {
          body: {
            logic,
            requirements: requirements[chain],
            limit: 0,
          },
        }
      ).then(({ addresses }) => addresses as string[])
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

const useBalancy = (
  index = -1
): {
  addresses: string[]
  holders: number
  usedLogic: "OR" | "AND"
  isLoading: boolean
  inaccuracy: number
} => {
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

  const renderedRequirements = useMemo<Requirement[]>(
    () =>
      (index >= 0 ? [debouncedRequirement] : debouncedRequirements)?.filter(
        ({ type }) => type !== null
      ) ?? [],
    [debouncedRequirements, index, debouncedRequirement]
  )

  const mappedRequirements = useMemo(() => {
    const filteredRequirements =
      renderedRequirements
        ?.filter(
          ({ type, address, chain, data, balancyDecimals }) =>
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
              chain,
              tokenAddress: address,
              minAmount: balancyMinAmount,
              maxAmount: balancyMaxAmount,
            }
          }
        ) ?? []

    const obj: Record<SupportedChain, BalancyRequirement[]> | Record<null, null> = {}

    filteredRequirements?.forEach((req) => {
      // TODO: we'll need to rework this part of the logic once we support negated requirements!
      if (!BALANCY_SUPPORTED_CHAINS[req.chain]) return
      if (!obj[req.chain]) obj[req.chain] = []

      obj[req.chain].push(req)
    })

    return obj
  }, [renderedRequirements])

  const shouldFetch = !!balancyLogic && Object.keys(mappedRequirements)?.length > 0

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
    if (Object.keys(mappedRequirements).length <= 0) {
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
      const holdersList = new Set([
        ...(data?.addresses ?? []),
        ...allowlists.filter((_) => !!_).flat(),
      ])

      setHolders({
        ...data,
        count: holdersList.size,
        addresses: Array.from(holdersList),
      })
      return
    }

    const holdersList = (data?.addresses ?? []).filter((address) =>
      allowlists.filter((_) => !!_).every((list) => list.includes(address))
    )

    setHolders({
      ...data,
      count: holdersList.length,
      addresses: holdersList,
    })
  }, [data, renderedRequirements])

  return {
    addresses: holders?.addresses,
    holders:
      requirement?.type === "ALLOWLIST"
        ? requirement.data?.validAddresses?.length
        : holders?.addresses?.length,
    usedLogic: holders?.usedLogic, // So we always display "at least", and "at most" according to the logic, we used to fetch holders
    isLoading: isValidating,
    inaccuracy:
      renderedRequirements.length -
      (Object.keys(mappedRequirements).length + allowlists.length), // Always non-negative
  }
}

export default useBalancy
