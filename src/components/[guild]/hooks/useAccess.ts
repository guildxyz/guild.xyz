import { useWeb3React } from "@web3-react/core"
import useGuild from "components/[guild]/hooks/useGuild"
import { useIntercom } from "components/_app/IntercomProvider"
import useSWRWithOptionalAuth from "hooks/useSWRWithOptionalAuth"
import { useEffect } from "react"
import { SWRConfiguration } from "swr"

const useAccess = (roleId?: number, swrOptions?: SWRConfiguration) => {
  const { account } = useWeb3React()
  const { id } = useGuild()

  const shouldFetch = account && id && roleId !== 0

  const { data, error, isLoading, isValidating, mutate } = useSWRWithOptionalAuth(
    shouldFetch ? `/guild/access/${id}/${account}` : null,
    {
      shouldRetryOnError: false,
      ...swrOptions,
    }
  )

  const roleData = roleId && data?.find?.((role) => role.roleId === roleId)

  const hasAccess = roleId ? roleData?.access : data?.some?.(({ access }) => access)

  const { addIntercomSettings } = useIntercom()
  useEffect(() => {
    if (!data?.length) return
    const nullAccesseErrors = data
      .filter((roleAccess) => roleAccess.access === null)
      .flatMap((roleAccess) => roleAccess.errors)
      .map((err) => err.errorType)

    if (nullAccesseErrors.length)
      addIntercomSettings({ errorMessages: nullAccesseErrors.join() })
  }, [data])

  return {
    data: roleData ?? data,
    error,
    hasAccess,
    isLoading,
    isValidating,
    mutate,
  }
}

export default useAccess
