import useGuild from "components/[guild]/hooks/useGuild"
import { usePostHogContext } from "components/_app/PostHogProvider"
import useCustomPosthogEvents from "hooks/useCustomPosthogEvents"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { GuildPlatform, PlatformType } from "types"
import fetcher from "utils/fetcher"

type AddRewardResponse = GuildPlatform & { roleIds?: number[] }

/**
 * To be used when a reward is entirely new, so the guildPlatform doesn't exist yet
 * (the BE handles adding rolePlatforms automatically to it too by the data we send).
 * If the guildPlatform already exists and we just want to create new rolePlatforms
 * to it, we should use the useAddRewardWithExistingGP hook
 */
const useAddReward = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (res?: AddRewardResponse) => void
  onError?: (err: any) => void
}) => {
  const { id, urlName, memberCount, mutateGuild } = useGuild()

  const { captureEvent } = usePostHogContext()
  const { rewardCreated } = useCustomPosthogEvents()
  const postHogOptions = { guild: urlName, memberCount }

  const showErrorToast = useShowErrorToast()
  const toast = useToast()

  const fetchData = async (signedValidation: SignedValidation) =>
    fetcher(`/v2/guilds/${id}/guild-platforms`, signedValidation)

  return useSubmitWithSign<AddRewardResponse>(fetchData, {
    onError: (error) => {
      showErrorToast(error)
      captureEvent("useAddReward error", { ...postHogOptions, error })
      onError?.(error)
    },
    onSuccess: (response) => {
      rewardCreated(response.platformId)

      if (response.platformId === PlatformType.CONTRACT_CALL) {
        captureEvent("Created NFT reward", {
          ...postHogOptions,
          hook: "useAddReward",
        })
      }

      toast({ status: "success", title: "Reward successfully added" })
      mutateGuild()
      onSuccess?.(response)
    },
  })
}

export default useAddReward
