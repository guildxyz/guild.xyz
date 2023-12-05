import useGuild from "components/[guild]/hooks/useGuild"
import { useUserPublic } from "components/[guild]/hooks/useUser"
import useSWRImmutable from "swr/immutable"
import { useFetcherWithSign } from "utils/fetcher"
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
  const { keyPair } = useUserPublic()
  const fetcherWithSign = useFetcherWithSign()

  const searchParams = new URLSearchParams({
    protocol,
    destination,
  })

  for (const roleId of roleIds ?? []) {
    searchParams.append("roleId", roleId.toString())
  }

  return useSWRImmutable<string[]>(
    !!keyPair && roleIds?.length > 0
      ? ["messages/reachable-targets", id, roleIds.join()]
      : null,
    ([_, guildId]) =>
      fetcherWithSign([
        `/v2/guilds/${guildId}/messages/reachable-targets?${searchParams.toString()}`,
        {
          method: "GET",
        },
      ])
  )
}

export default useReachableUsers
