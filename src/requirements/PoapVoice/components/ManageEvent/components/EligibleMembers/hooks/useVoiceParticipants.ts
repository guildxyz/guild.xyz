import { useState } from "react"
import useSWRImmutable from "swr/immutable"

type VoiceParticipant = {
  participationTime: number
  isEligible: boolean
  discordTag: string
}

const useVoiceParticipants = (
  poapId
): {
  voiceParticipants: VoiceParticipant[]
  isVoiceParticipantsLoading: boolean
  latestFetch: number
  mutateVoiceParticipants: (newData?: any) => void
} => {
  const [latestFetch, setLatestFetch] = useState(Date.now())

  const { data, isValidating, mutate } = useSWRImmutable(
    poapId ? `/assets/poap/voiceParticipants/${poapId}` : null,
    { shouldRetryOnError: false }
  )

  return {
    voiceParticipants: data,
    isVoiceParticipantsLoading: isValidating,
    latestFetch,
    mutateVoiceParticipants: (newData?: any) => {
      if (!data && Date.now() - latestFetch <= 15000) return
      mutate(newData)
      setLatestFetch(Date.now())
    },
  }
}

export default useVoiceParticipants
