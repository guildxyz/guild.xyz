import useGuild from "components/[guild]/hooks/useGuild"
import usePoapEventDetails from "requirements/PoapVoice/hooks/usePoapEventDetails"
import useSWR from "swr"
import { useAccount } from "wagmi"

const useUserPoapEligibility = (poapIdentifier: number) => {
  const { address } = useAccount()
  const { poapEventDetails } = usePoapEventDetails(poapIdentifier)
  const { poaps } = useGuild()
  const guildPoap = poaps?.find((p) => p.poapIdentifier === poapIdentifier)

  const { data, isValidating, mutate } = useSWR(
    address && poapIdentifier
      ? `/v2/guilds/:guildId/poaps/${poapIdentifier}/users/${address}/eligibility`
      : null,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  )

  if (!poapIdentifier) return { data: {} }

  const generalReqData = data?.userAccesses?.[0]?.users?.[0]

  const generalReqAccess = generalReqData ? generalReqData.access : true
  const voiceEligibility = poapEventDetails?.voiceChannelId
    ? data?.voiceEligibility
    : true
  const hasPaid = guildPoap?.poapContracts?.length ? data?.hasPaid : true

  const hasAccess = voiceEligibility && hasPaid && generalReqAccess

  return {
    data: {
      ...generalReqData,
      voiceEligibility,
      hasPaid,
      access: hasAccess,
    },
    isLoading: isValidating && !hasAccess,
    mutate,
  }
}

export default useUserPoapEligibility
