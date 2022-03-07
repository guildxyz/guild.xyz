import { useMemo } from "react"
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

const useERC20Holders = () => {
  const requirements = useWatch({ name: "requirements" })
  const logic = useWatch({ name: "logic" })

  const mappedRequirements = useMemo(
    () =>
      requirements
        ?.filter(
          ({ type, address, chain, data: { amount } }) =>
            type === "ERC20" /* || type === "COIN" */ &&
            address?.length > 0 &&
            chain === "ETHEREUM" &&
            /^[0-9]+$/.test(amount)
        )
        .map(({ address, data: { amount } }) => ({ token: address, amount })),
    [requirements]
  )

  const shouldFetch = !!logic && mappedRequirements?.length > 0

  const { data, isValidating } = useSWR(
    shouldFetch ? ["ERC20Holders", logic, mappedRequirements, 1] : null,
    fetchERC20Holders
  )

  return { holders: data?.pagination?.count, isLoading: isValidating }
}

export default useERC20Holders
