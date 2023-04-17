import { useWeb3React } from "@web3-react/core"
import useGuild from "components/[guild]/hooks/useGuild"
import useSWRWithOptionalAuth from "hooks/useSWRWithOptionalAuth"
import platforms from "platforms/platforms"
import { usePostHog } from "posthog-js/react"
import { SWRConfiguration } from "swr"

const useAccess = (roleId?: number, swrOptions?: SWRConfiguration) => {
  const { account } = useWeb3React()
  const { id } = useGuild()

  const shouldFetch = account && id && roleId !== 0
  const posthog = usePostHog()

  const { data, error, isValidating, mutate } = useSWRWithOptionalAuth(
    shouldFetch ? `/guild/access/${id}/${account}` : null,
    {
      shouldRetryOnError: false,
      onSuccess: (accessCheckResult: any) => {
        const unconnectedPlatforms = Object.keys(platforms).filter((platform) =>
          accessCheckResult.some(({ errors }) =>
            errors?.some(
              ({ subType, errorType }) =>
                subType.toUpperCase() === platform &&
                errorType === "PLATFORM_NOT_CONNECTED"
            )
          )
        )

        const platformsToReconnect = Object.keys(platforms).filter((platform) =>
          accessCheckResult.some(({ errors }) =>
            errors?.some(
              ({ subType, errorType }) =>
                subType.toUpperCase() === platform &&
                errorType === "PLATFORM_CONNECT_INVALID"
            )
          )
        )

        posthog.capture("Access check", {
          accessCheckResult,
          unconnectedPlatforms,
          platformsToReconnect,
        })
      },
      ...swrOptions,
    }
  )

  const roleData = roleId && data?.find?.((role) => role.roleId === roleId)

  const hasAccess = roleId ? roleData?.access : data?.some?.(({ access }) => access)

  return {
    data: roleData ?? data,
    error,
    hasAccess,
    isLoading: isValidating,
    mutate,
  }
}

export default useAccess
