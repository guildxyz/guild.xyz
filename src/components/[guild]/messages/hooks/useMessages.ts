import useGuild from "components/[guild]/hooks/useGuild"
import { useKeyPair } from "components/_app/KeyPairProvider"
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
  const { isValid } = useKeyPair()
  const fetcherWithSign = useFetcherWithSign()

  return useSWRImmutable<Message[]>(
    isValid ? ["messages", id] : null,
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
