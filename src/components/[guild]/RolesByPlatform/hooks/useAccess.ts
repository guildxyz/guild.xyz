import { useWeb3React } from "@web3-react/core"
import useGuild from "components/[guild]/hooks/useGuild"
import useSWR from "swr"

const useAccess = (roleIds?: number[]) => {
  const { account, active } = useWeb3React()
  const { id } = useGuild()

  const shouldFetch = account

  const { data, isValidating } = useSWR(
    shouldFetch ? `/guild/access/${id}/${account}` : null
  )

  const relevantRoles = data?.filter?.(({ roleId }) => roleIds.includes(roleId))

  const hasAccess = relevantRoles?.some?.(({ access }) => access)

  if (!active) return { data, error: "Wallet not connected" }

  return {
    hasAccess,
    isLoading: data === undefined && isValidating,
  }
}

export default useAccess
