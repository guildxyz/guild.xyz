import useGuild from "components/[guild]/hooks/useGuild"
import { usePostHogContext } from "components/_app/PostHogProvider"
import useCustomPosthogEvents from "hooks/useCustomPosthogEvents"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { GuildPlatform, PlatformType } from "types"
import fetcher from "utils/fetcher"

const useAddReward = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void
  onError?: (err: unknown) => void
}) => {
  const { id, urlName, memberCount, mutateGuild } = useGuild()

  const { captureEvent } = usePostHogContext()
  const { rewardCreated } = useCustomPosthogEvents()
  const postHogOptions = { guild: urlName, memberCount }

  const showErrorToast = useShowErrorToast()
  const toast = useToast()

  const fetchData = async (signedValidation: SignedValidation) =>
    fetcher(`/v2/guilds/${id}/guild-platforms`, signedValidation)

  return useSubmitWithSign<GuildPlatform & { roleIds?: number[] }>(fetchData, {
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
      onSuccess?.()
    },
  })
}

export default useAddReward
