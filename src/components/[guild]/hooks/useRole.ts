import useSWRImmutable from "swr/immutable"
import { SimpleRole } from "types"
import { useFetcherWithSign } from "utils/fetcher"

const useRole = (guildId: number | string, roleId: number) => {
  const url = `/v2/guilds/${guildId}/roles/${roleId}`

  const { data: unauthenticatedData, isLoading: isUnauthenticatedRequestLoading } =
    useSWRImmutable<SimpleRole>(guildId && roleId ? url : null, {
      shouldRetryOnError: false,
    })

  const fetcherWithSign = useFetcherWithSign()
  const { data: authenticatedData, isLoading: isAuthenticatedRequestLoading } =
    useSWRImmutable<SimpleRole>(
      guildId && roleId && !isUnauthenticatedRequestLoading && !unauthenticatedData
        ? [url, { method: "GET", body: {} }]
        : null,
      fetcherWithSign,
      {
        shouldRetryOnError: false,
      }
    )

  return {
    ...(unauthenticatedData || authenticatedData),
    isLoading: isUnauthenticatedRequestLoading || isAuthenticatedRequestLoading,
  }
}

export default useRole
