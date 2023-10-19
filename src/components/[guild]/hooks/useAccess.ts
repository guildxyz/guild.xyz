import useGuild from "components/[guild]/hooks/useGuild"
import { useIntercom } from "components/_app/IntercomProvider"
import useSWRWithOptionalAuth from "hooks/useSWRWithOptionalAuth"
import { useEffect } from "react"
import { SWRConfiguration } from "swr"
import { useAccount } from "wagmi"

const useAccess = (roleId?: number, swrOptions?: SWRConfiguration) => {
  const { address } = useAccount()
  const { id } = useGuild()

  const shouldFetch = address && id && roleId !== 0

  const { data, error, isLoading, isValidating, mutate } = useSWRWithOptionalAuth(
    shouldFetch ? `/guild/access/${id}/${address}` : null,
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
    const nullAccesseErrors = [
      ...new Set(
        data
          .filter((roleAccess) => roleAccess.access === null)
          .flatMap((roleAccess) => roleAccess.errors)
          .filter(Boolean)
          .map((err) => err.errorType)
      ),
    ]

    if (nullAccesseErrors.length)
      addIntercomSettings({ errorMessage: nullAccesseErrors.join() })
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
