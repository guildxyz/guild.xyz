import useSWR from "swr"

type Channel = {
  name: string
  id: string
}

const useVoiceChannels = (
  serverId: string
): { voiceChannels: Channel[]; isVoiceChannelsLoading } => {
  const { data, isValidating } = useSWR<Channel[]>(
    serverId ? `/discord/voiceChannels/${serverId}` : null
  )

  return {
    voiceChannels: data,
    isVoiceChannelsLoading: isValidating,
  }
}

export default useVoiceChannels
