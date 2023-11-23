import useWeb3ConnectionManager from "components/_app/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import usePoapEventDetails from "requirements/PoapVoice/hooks/usePoapEventDetails"
import useSWR from "swr"

const useUserPoapEligibility = (poapIdentifier: number) => {
  const { address } = useWeb3ConnectionManager()
  const { poapEventDetails } = usePoapEventDetails(poapIdentifier)

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

  const hasAccess = voiceEligibility && generalReqAccess

  return {
    data: {
      ...generalReqData,
      voiceEligibility,
      access: hasAccess,
    },
    isLoading: isValidating && !hasAccess,
    mutate,
  }
}

export default useUserPoapEligibility
