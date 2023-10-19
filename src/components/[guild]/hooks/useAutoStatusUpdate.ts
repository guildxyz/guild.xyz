import { useKeyPair } from "components/_app/KeyPairProvider"
import useMemberships from "components/explorer/hooks/useMemberships"
import { mutateOptionalAuthSWRKey } from "hooks/useSWRWithOptionalAuth"
import { useEffect } from "react"
import { useFetcherWithSign } from "utils/fetcher"
import { useAccount } from "wagmi"
import useAccess from "./useAccess"
import useGuild from "./useGuild"

const useAutoStatusUpdate = () => {
  const { address } = useAccount()
  const { id } = useGuild()
  const { keyPair } = useKeyPair()

  const { data: accesses } = useAccess()
  const { memberships } = useMemberships()

  const roleMemberships = memberships?.find(
    (membership) => membership.guildId === id
  )?.roleIds

  const fetcherWithSign = useFetcherWithSign()

  useEffect(() => {
    if (
      !keyPair ||
      !address ||
      !Array.isArray(accesses) ||
      !Array.isArray(roleMemberships) ||
      !accesses?.length ||
      !roleMemberships?.length
    )
      return

    const roleMembershipsSet = new Set(roleMemberships)

    const accessedRoleIds = accesses
      .filter(({ access }) => !!access)
      .map(({ roleId }) => roleId)

    const unaccessedRoleIdsSet = new Set(
      accesses.filter(({ access }) => access === false).map(({ roleId }) => roleId)
    )

    const shouldSendStatusUpdate =
      !accesses.some((roleAccess) => roleAccess.errors) &&
      (accessedRoleIds.some(
        (accessedRoleId) => !roleMembershipsSet.has(accessedRoleId)
      ) ||
        roleMemberships.some((roleId) => unaccessedRoleIdsSet.has(roleId)))
    if (shouldSendStatusUpdate) {
      fetcherWithSign([
        `/user/${address}/statusUpdate/${id}`,
        {
          method: "GET",
          body: {},
        },
      ]).then(() =>
        Promise.all([
          mutateOptionalAuthSWRKey(`/guild/access/${id}/${address}`),
          mutateOptionalAuthSWRKey(`/v2/users/${address}/memberships`),
        ])
      )
    }
  }, [accesses, roleMemberships, address, id])
}

export default useAutoStatusUpdate
