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

  // temporary until roles are grouped by platform already in the endpoint
  const relevantRoles = data?.filter?.(({ roleId }) => roleIds.includes(roleId))

  // temporary until join happens by platform id instead of role
  const firstRoleIdWithAccess = relevantRoles?.find?.(({ access }) => access)?.roleId

  if (!active) return { data, error: "Wallet not connected" }

  return {
    hasAccess: !!firstRoleIdWithAccess,
    isLoading: data === undefined && isValidating,
    firstRoleIdWithAccess,
  }
}

export default useAccess
