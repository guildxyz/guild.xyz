import useGuild from "components/[guild]/hooks/useGuild"
import { useUserPublic } from "components/[guild]/hooks/useUser"
import useSWRImmutable from "swr/immutable"
import { useFetcherWithSign } from "utils/fetcher"
import { MessageDestination, MessageProtocol } from "./useSendMessage"

export type Message = {
  id: number
  guildId: number
  protocol: MessageProtocol
  destination: MessageDestination
  message: string
  status: "PENDING" | "SENT"
  roleIds: number[]
  receiverCount: number
  createdAt: string
}

const useMessages = () => {
  const { id } = useGuild()
  const { keyPair } = useUserPublic()
  const fetcherWithSign = useFetcherWithSign()

  return useSWRImmutable<Message[]>(
    !!keyPair ? ["messages", id] : null,
    ([_, guildId]) =>
      fetcherWithSign([
        `/v2/guilds/${guildId}/messages`,
        {
          method: "GET",
          body: {},
        },
      ])
  )
}

export default useMessages
