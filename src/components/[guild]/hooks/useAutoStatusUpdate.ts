import useWeb3ConnectionManager from "components/_app/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import useMemberships from "components/explorer/hooks/useMemberships"
import { useEffect } from "react"
import { useFetcherWithSign } from "utils/fetcher"
import useAccess from "./useAccess"
import useGuild from "./useGuild"
import { useUserPublic } from "./useUser"

const useAutoStatusUpdate = () => {
  const { isWeb3Connected, address } = useWeb3ConnectionManager()
  const { id, mutateGuild } = useGuild()
  const { keyPair } = useUserPublic()

  const { data: accesses, mutate: mutateAccess } = useAccess()
  const { memberships, mutate: mutateMemberships } = useMemberships()

  const roleMemberships = memberships?.find(
    (membership) => membership.guildId === id
  )?.roleIds

  const fetcherWithSign = useFetcherWithSign()

  useEffect(() => {
    if (
      !keyPair ||
      !isWeb3Connected ||
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
      accesses.every(
        (roleAccess) => !!roleAccess || !roleAccess.roleAccess.errors
      ) &&
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
        Promise.all([mutateAccess(), mutateMemberships(), mutateGuild()])
      )
    }
  }, [accesses, roleMemberships, address, id])
}

export default useAutoStatusUpdate
