import { useCreatePoapContext } from "components/[guild]/CreatePoap/components/CreatePoapContext"
import { useState } from "react"
import useSWRImmutable from "swr/immutable"

type VoiceParticipant = {
  participationTime: number
  isEligible: boolean
  discordTag: string
}

const useVoiceParticipants = (): {
  voiceParticipants: VoiceParticipant[]
  isVoiceParticipantsLoading: boolean
  latestFetch: number
  mutateVoiceParticipants: (newData?: any) => void
} => {
  const { poapData } = useCreatePoapContext()

  const [latestFetch, setLatestFetch] = useState(Date.now())

  const { data, isValidating, mutate } = useSWRImmutable(
    poapData?.id ? `/assets/poap/voiceParticipants/${poapData.id}` : null,
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
