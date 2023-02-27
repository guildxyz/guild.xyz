import { useWeb3React } from "@web3-react/core"
import useGuild from "components/[guild]/hooks/useGuild"
import useSWRWithOptionalAuth from "hooks/useSWRWithOptionalAuth"

const useAccess = (roleId?: number) => {
  const { account } = useWeb3React()
  const { id } = useGuild()

  const shouldFetch = account && id

  const { data, isValidating, mutate } = useSWRWithOptionalAuth(
    shouldFetch ? `/guild/access/${id}/${account}` : null,
    { shouldRetryOnError: false }
  )

  const roleData = roleId && data?.find?.((role) => role.roleId === roleId)

  const hasAccess = roleId ? roleData?.access : data?.some?.(({ access }) => access)

  return {
    data: roleData ?? data,
    hasAccess,
    isLoading: isValidating,
    mutate,
  }
}

export default useAccess
