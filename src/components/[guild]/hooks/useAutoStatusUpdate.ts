import { useRumAction } from "@datadog/rum-react-integration"
import { useWeb3React } from "@web3-react/core"
import useMemberships from "components/explorer/hooks/useMemberships"
import { useEffect } from "react"
import { mutate as swrMutate } from "swr"
import fetcher from "utils/fetcher"
import useAccess from "../RolesByPlatform/hooks/useAccess"
import useGuild from "./useGuild"

const useAutoStatusUpdate = () => {
  const addDatadogAction = useRumAction("trackingAppAction")
  const { account } = useWeb3React()
  const { id } = useGuild()

  const { data: roleAccesses } = useAccess()
  const memberships = useMemberships()

  const roleMemberships = memberships?.find(
    (membership) => membership.guildId === id
  )?.roleIds

  useEffect(() => {
    if (!account || !Array.isArray(roleAccesses) || !Array.isArray(roleMemberships))
      return

    const roleMembershipsSet = new Set(roleMemberships)

    const accessedRoleIds = roleAccesses
      .filter(({ access }) => !!access)
      .map(({ roleId }) => roleId)

    const isMemberInEveryAccessedRole =
      accessedRoleIds.every((accessedRoleId) =>
        roleMembershipsSet.has(accessedRoleId)
      ) && roleMemberships.every((roleId) => accessedRoleIds.includes(roleId))

    if (!isMemberInEveryAccessedRole) {
      addDatadogAction("Automatic statusUpdate")
      fetcher(`/user/${account}/statusUpdate/${id}`).then(() =>
        Promise.all([
          swrMutate(`/guild/access/${id}/${account}`),
          swrMutate(`/user/membership/${account}`),
        ])
      )
    }
  }, [roleAccesses, roleMemberships, account, id])
}

export default useAutoStatusUpdate
