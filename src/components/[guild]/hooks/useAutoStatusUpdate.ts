import useWeb3ConnectionManager from "components/_app/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import useMembership from "components/explorer/hooks/useMemberships"
import { useEffect } from "react"
import { useFetcherWithSign } from "utils/fetcher"
import useJoin from "../JoinModal/hooks/useJoin"
import useGuild from "./useGuild"
import { useUserPublic } from "./useUser"

const useAutoStatusUpdate = () => {
  const { isWeb3Connected, address } = useWeb3ConnectionManager()
  const { id, mutateGuild } = useGuild()
  const { keyPair } = useUserPublic()

  const { onSubmit: onJoin } = useJoin()
  const {
    mutate: mutateMemberships,
    membership,
    roleIds: roleMemberships,
  } = useMembership()

  const fetcherWithSign = useFetcherWithSign()

  useEffect(() => {
    if (
      !keyPair ||
      !isWeb3Connected ||
      !Array.isArray(membership?.roles) ||
      !Array.isArray(roleMemberships) ||
      !membership?.roles?.length ||
      !roleMemberships?.length
    )
      return

    const roleMembershipsSet = new Set(roleMemberships)

    const accessedRoleIds = membership?.roles
      .filter(({ access }) => !!access)
      .map(({ roleId }) => roleId)

    const unaccessedRoleIdsSet = new Set(
      membership?.roles
        .filter(({ access }) => access === false)
        .map(({ roleId }) => roleId)
    )

    const shouldSendStatusUpdate =
      membership?.roles.every(
        (roleAccess) =>
          !!roleAccess ||
          !roleAccess.requirements?.some((req) => req.access === null)
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
      ]).then(() => {
        onJoin()
        Promise.all([mutateMemberships(), mutateGuild()])
      })
    }
  }, [membership, roleMemberships, address, id])
}

export default useAutoStatusUpdate
