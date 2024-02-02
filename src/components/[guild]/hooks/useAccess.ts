import type { AccessCheckJob } from "@guildxyz/types"
import useGuild from "components/[guild]/hooks/useGuild"
import { useIntercom } from "components/_app/IntercomProvider"
import useWeb3ConnectionManager from "components/_app/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import useMemberships from "components/explorer/hooks/useMemberships"
import { useEffect } from "react"
import useSWR, { SWRConfiguration } from "swr"
import createAndAwaitJob from "utils/createAndAwaitJob"
import { useFetcherWithSign } from "utils/fetcher"
import { QUEUE_FEATURE_FLAG } from "../JoinModal/hooks/useJoin"

const useAccess = (roleId?: number, swrOptions?: SWRConfiguration) => {
  const { address } = useWeb3ConnectionManager()
  const { id, featureFlags, parentRoles } = useGuild()
  const { memberships } = useMemberships()
  const guildMembership = memberships?.find(({ guildId }) => guildId === id)

  // If there is a role, which:
  //   - we see
  //   - we aren't a member in
  //   - is used as visibility input for some other role (only works for roles)
  const revalidateOnFocus =
    !!parentRoles &&
    !!guildMembership &&
    parentRoles.length > 0 &&
    parentRoles.some(
      (parentRoleId) => !guildMembership.roleIds.includes(parentRoleId)
    )

  const fetcherWithSign = useFetcherWithSign()

  const { data, error, isLoading, isValidating, mutate } = useSWR(
    !!guildMembership ? `/guild/access/${id}/${address}` : null,
    async (key) => {
      if (featureFlags.includes(QUEUE_FEATURE_FLAG)) {
        const { roleAccesses, "children:access-check:jobs": requirementResults } =
          await createAndAwaitJob<AccessCheckJob>(
            fetcherWithSign,
            "/v2/actions/access-check",
            { guildId: id },
            { guildId: `${id}` }
          )

        return roleAccesses.map((roleAccess) => {
          const requirementResultsOfRole = requirementResults?.filter(
            (reqAcc) => reqAcc.roleId === roleAccess.roleId
          )

          return {
            roleId: roleAccess?.roleId,
            access: roleAccess?.access,
            requirements:
              requirementResultsOfRole?.map(({ requirementId, access, amount }) => ({
                requirementId,
                access,
                amount,
              })) ?? [],
            errors:
              requirementResultsOfRole?.flatMap(
                ({ requirementError, userLevelErrors }) => {
                  const errors = []
                  if (requirementError) {
                    errors.push(requirementError)
                  }
                  if (userLevelErrors) {
                    errors.push(...userLevelErrors)
                  }
                  return errors
                }
              ) ?? [],
          }
        })
      }

      return fetcherWithSign([key, { method: "GET" }])
    },
    {
      shouldRetryOnError: false,
      ...swrOptions,
      revalidateIfStale: false,
      revalidateOnFocus,
      revalidateOnReconnect: false,
      // dedupingInterval: 10000
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
