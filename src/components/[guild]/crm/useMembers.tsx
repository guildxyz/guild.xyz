import useSWR from "swr"
import { Visibility } from "types"
import useGuild from "../hooks/useGuild"
import useUser from "../hooks/useUser"

const useMembers = () => {
  const { addresses, platformUsers } = useUser()
  const { roles } = useGuild()

  const userData = {
    id: 0,
    addresses,
    platformUsers,
    joinedAt: "2022-08-11T13:11:09.546Z",
    publicRoleIds: roles
      ?.filter((role) => role.visibility === Visibility.PUBLIC)
      .map((role) => role.id),
    hiddenRoleIds: roles
      ?.filter((role) => role.visibility === Visibility.HIDDEN)
      .map((role) => role.id),
  }

  const shouldFetch = !!platformUsers

  return useSWR(
    "members",
    shouldFetch ? () => [...Array(20)].map((_, i) => userData) : null
  )
}

export default useMembers
