import { useWeb3React } from "@web3-react/core"
import useGuild from "components/[guild]/hooks/useGuild"
import usePoapEventDetails from "requirements/PoapVoice/hooks/usePoapEventDetails"
import useSWR from "swr"

const useUserPoapEligibility = (poapIdentifier: number) => {
  const { account } = useWeb3React()
  const { poapEventDetails } = usePoapEventDetails()
  const { poaps } = useGuild()
  const guildPoap = poaps?.find((p) => p.poapIdentifier === poapIdentifier)

  const { data, isValidating, mutate } = useSWR(
    account && poapIdentifier
      ? `/assets/poap/checkUserPoapEligibility/${poapIdentifier}/${account}`
      : null,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  )

  const voiceEligibility = poapEventDetails?.voiceChannelId
    ? data?.voiceEligibility
    : true
  const hasPaid = guildPoap?.poapContracts?.length ? data?.hasPaid : true

  const reqData = data?.userAccesses?.[0]?.users?.[0] ?? {
    access: voiceEligibility && hasPaid,
  }

  return {
    data: {
      voiceEligibility,
      hasPaid,
      ...reqData,
    },
    isLoading: isValidating && !data,
    mutate,
  }
}

export default useUserPoapEligibility
