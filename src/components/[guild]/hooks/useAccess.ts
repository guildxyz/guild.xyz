import { useWeb3React } from "@web3-react/core"
import useGuild from "components/[guild]/hooks/useGuild"
import useSWR from "swr"

const useAccess = (roleId?: number) => {
  const { account } = useWeb3React()
  const { id } = useGuild()

  const shouldFetch = account

  const { data, isValidating, error, mutate } = useSWR(
    shouldFetch ? `/guild/access/${id}/${account}` : null,
    { shouldRetryOnError: false }
  )

  const hasAccess = roleId
    ? (data ?? error)?.find?.((role) => role.roleId === roleId)?.access
    : (data ?? error)?.some?.(({ access }) => access)

  return {
    data,
    hasAccess,
    error,
    isLoading: isValidating,
    mutate,
  }
}

export default useAccess
