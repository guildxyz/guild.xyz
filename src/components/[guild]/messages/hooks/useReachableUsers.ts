import useGuild from "components/[guild]/hooks/useGuild"
import { useKeyPair } from "components/_app/KeyPairProvider"
import useSWRImmutable from "swr/immutable"
import { useFetcherWithSign } from "utils/fetcher"
import { MessageDestination, MessageProtocol } from "./useSendMessage"

const useReachableUsers = (
  protocol: MessageProtocol,
  destination: MessageDestination,
  roleIds: number[]
) => {
  const { id } = useGuild()
  const { isValid } = useKeyPair()
  const fetcherWithSign = useFetcherWithSign()

  const searchParams = new URLSearchParams({
    protocol,
    destination,
  })

  for (const roleId of roleIds ?? []) {
    searchParams.append("roleId", roleId.toString())
  }

  return useSWRImmutable<string[]>(
    isValid && roleIds?.length > 0
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
