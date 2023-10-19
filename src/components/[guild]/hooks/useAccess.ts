import type { AccessCheckJob } from "@guildxyz/types"
import { useWeb3React } from "@web3-react/core"
import useGuild from "components/[guild]/hooks/useGuild"
import { useIntercom } from "components/_app/IntercomProvider"
import { useKeyPair } from "components/_app/KeyPairProvider"
import { useEffect } from "react"
import { SWRConfiguration } from "swr"
import useSWRImmutable from "swr/immutable"
import createAndAwaitJob from "utils/createAndAwaitJob"
import { useFetcherWithSign } from "utils/fetcher"
import { QUEUE_FEATURE_FLAG } from "../JoinModal/hooks/useJoin"

const useAccess = (roleId?: number, swrOptions?: SWRConfiguration) => {
  const { account } = useWeb3React()
  const { id, featureFlags, roles } = useGuild()
  const { isValid } = useKeyPair()

  const shouldFetch = account && id && roleId !== 0 && isValid

  const fetcherWithSign = useFetcherWithSign()

  const { data, error, isLoading, isValidating, mutate } = useSWRImmutable(
    shouldFetch ? `/guild/access/${id}/${account}` : null,
    async (key) => {
      if (featureFlags.includes(QUEUE_FEATURE_FLAG)) {
        const requirementIdToRoleId = Object.fromEntries(
          roles?.flatMap((role) =>
            role.requirements?.map((req) => [req.id, role.id] as [number, number])
          )
        )

        const { roleAccesses, "children:access-check:jobs": requirementResults } =
          await createAndAwaitJob<AccessCheckJob>(
            fetcherWithSign,
            "/v2/actions/access-check",
            { guildId: id },
            { guildId: `${id}` }
          )

        return roleAccesses.map((roleAccess) => {
          const errors = requirementResults
            ?.filter(
              (reqAcc) =>
                requirementIdToRoleId[reqAcc.requirementId] === roleAccess?.roleId
            )
            .map((reqAccess) => (reqAccess as any)?.error)
            ?.filter(Boolean)

          return {
            roleId: roleAccess?.roleId,
            access: roleAccess?.access,
            requirements: requirementResults?.filter(
              (reqAcc) =>
                requirementIdToRoleId[reqAcc.requirementId] === roleAccess?.roleId
            ),
            ...(errors?.length > 0 ? { errors } : {}),
          }
        })
      }

      return fetcherWithSign([key, { method: "GET" }])
    },
    { shouldRetryOnError: false, ...swrOptions }
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
