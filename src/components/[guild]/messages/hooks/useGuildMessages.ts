import useGuild from "components/[guild]/hooks/useGuild"
import useSWRWithOptionalAuth from "hooks/useSWRWithOptionalAuth"
import {
  MessageDestination,
  MessageProtocol,
} from "../SendNewMessage/SendNewMessage"

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

const useGuildMessages = () => {
  const { id } = useGuild()
  return useSWRWithOptionalAuth<Message[]>(!!id ? `/v2/guilds/${id}/messages` : null)
}

export default useGuildMessages
