import { useWeb3React } from "@web3-react/core"
import useKeyPair from "components/_app/useKeyPairContext"
import useMemberships from "components/explorer/hooks/useMemberships"
import { mutateOptionalAuthSWRKey } from "hooks/useSWRWithOptionalAuth"
import { useEffect } from "react"
import { useFetcherWithSign } from "utils/fetcher"
import useAccess from "./useAccess"
import useGuild from "./useGuild"

const useAutoStatusUpdate = () => {
  const { account } = useWeb3React()
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
      !account ||
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
        `/user/${account}/statusUpdate/${id}`,
        {
          method: "GET",
          body: {},
        },
      ]).then(() =>
        Promise.all([
          mutateOptionalAuthSWRKey(`/guild/access/${id}/${account}`),
          mutateOptionalAuthSWRKey(`/user/membership/${account}`),
        ])
      )
    }
  }, [accesses, roleMemberships, account, id])
}

export default useAutoStatusUpdate
