import { useWeb3React } from "@web3-react/core"
import useGuild from "components/[guild]/hooks/useGuild"
import useSWR from "swr"

const useAccess = (roleIds?: number[]) => {
  const { account } = useWeb3React()
  const { id } = useGuild()

  const shouldFetch = account

  const { data, isValidating, error } = useSWR(
    shouldFetch ? `/guild/access/${id}/${account}` : null,
    { shouldRetryOnError: false }
  )

  const relevantRoles = (data ?? error)?.filter?.(({ roleId }) =>
    roleIds.includes(roleId)
  )

  const hasAccess = relevantRoles?.some?.(({ access }) => access)

  return {
    hasAccess,
    error,
    isLoading: data === undefined && isValidating,
  }
}

export default useAccess
