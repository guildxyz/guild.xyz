import { useFetcherWithSign } from "hooks/useFetcherWithSign"
import { useGetKeyForSWRWithOptionalAuth } from "hooks/useGetKeyForSWRWithOptionalAuth"
import useSWRImmutable from "swr/immutable"
import { Role } from "types"
import useGuild from "./useGuild"

const useRole = (guildId: number | string, roleId: number) => {
  const url = `/v2/guilds/${guildId}/roles/${roleId}`
  const getKeyForSWRWithOptionalAuth = useGetKeyForSWRWithOptionalAuth()

  /**
   * If the role is from the current guild, we don't need to fetch it separately,
   * since we already have the necessary data in the `useGuild` SWR cache
   */
  const { id, roles } = useGuild()
  const isFromCurrentGuild = guildId === id
  const shouldFetch = !!guildId && !!roleId && !isFromCurrentGuild

  const { data: unauthenticatedData, isLoading: isUnauthenticatedRequestLoading } =
    useSWRImmutable<Role>(shouldFetch ? url : null, {
      shouldRetryOnError: false,
    })

  const fetcherWithSign = useFetcherWithSign()
  const { data: authenticatedData, isLoading: isAuthenticatedRequestLoading } =
    useSWRImmutable<Role>(
      shouldFetch && !isUnauthenticatedRequestLoading && !unauthenticatedData
        ? getKeyForSWRWithOptionalAuth(url)
        : null,
      fetcherWithSign,
      {
        shouldRetryOnError: false,
      }
    )

  return {
    ...(isFromCurrentGuild
      ? roles.find((role) => role.id === roleId)
      : unauthenticatedData || authenticatedData),
    isLoading: isUnauthenticatedRequestLoading || isAuthenticatedRequestLoading,
  }
}

export default useRole
