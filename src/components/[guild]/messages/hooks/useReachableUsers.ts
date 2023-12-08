import useGuild from "components/[guild]/hooks/useGuild"
import useSWRWithOptionalAuth from "hooks/useSWRWithOptionalAuth"
import {
  MessageDestination,
  MessageProtocol,
} from "../SendNewMessage/SendNewMessage"

const useReachableUsers = (
  protocol: MessageProtocol,
  destination: MessageDestination,
  roleIds: number[]
) => {
  const { id } = useGuild()
  const searchParams = new URLSearchParams({
    protocol,
    destination,
  })

  for (const roleId of roleIds ?? []) {
    searchParams.append("roleId", roleId.toString())
  }

  return useSWRWithOptionalAuth<string[]>(
    roleIds?.length > 0
      ? `/v2/guilds/${id}/messages/reachable-targets?${searchParams.toString()}`
      : null
  )
}

export default useReachableUsers
