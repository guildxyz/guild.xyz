import { useWeb3React } from "@web3-react/core"
import useMemberships from "components/explorer/hooks/useMemberships"
import useKeyPair from "hooks/useKeyPair"
import { mutateOptionalAuthSWRKey } from "hooks/useSWRWithOptionalAuth"
import { useEffect } from "react"
import { useFetcherWithSign } from "utils/fetcher"
import useAccess from "./useAccess"
import useGuild from "./useGuild"

const useAutoStatusUpdate = () => {
  const { account } = useWeb3React()
  const { id, roles } = useGuild()
  const { keyPair } = useKeyPair()

  const {
    data: { roleAccesses, requirementErrors },
  } = useAccess()
  const { memberships } = useMemberships()

  const roleMemberships = memberships?.find(
    (membership) => membership.guildId === id
  )?.roleIds

  const fetcherWithSign = useFetcherWithSign()

  useEffect(() => {
    if (
      !keyPair ||
      !account ||
      !Array.isArray(roleAccesses) ||
      !Array.isArray(roleMemberships) ||
      !roleAccesses?.length ||
      !roleMemberships?.length
    )
      return

    const roleMembershipsSet = new Set(roleMemberships)

    const accessedRoleIds = roleAccesses
      .filter(({ access }) => !!access)
      .map(({ roleId }) => roleId)

    const unaccessedRoleIdsSet = new Set(
      roleAccesses
        .filter(({ access }) => access === false)
        .map(({ roleId }) => roleId)
    )

    const shouldSendStatusUpdate =
      !roleAccesses.some(
        (roleAccess) =>
          // TODO: I kinda just cowboy coded it here, make sure this actually works
          requirementErrors?.filter(({ requirementId }) => {
            const requirementsOfRole = roles
              .find(({ id: roleId }) => roleId === roleAccess.roleId)
              ?.requirements?.map((req) => req.id)
            return requirementsOfRole?.includes(requirementId)
          })?.length > 0
      ) &&
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
  }, [roleAccesses, roles, requirementErrors, roleMemberships, account, id])
}

export default useAutoStatusUpdate
