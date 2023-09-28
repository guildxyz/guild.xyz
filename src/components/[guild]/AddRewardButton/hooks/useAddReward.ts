import useGuild from "components/[guild]/hooks/useGuild"
import { usePostHogContext } from "components/_app/PostHogProvider"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { GuildPlatform, PlatformType } from "types"
import fetcher from "utils/fetcher"

const useAddReward = (onSuccess?) => {
  const { id, urlName, memberCount, mutateGuild } = useGuild()

  const { captureEvent } = usePostHogContext()
  const postHogOptions = { guild: urlName, memberCount }

  const showErrorToast = useShowErrorToast()
  const toast = useToast()

  const fetchData = async (signedValdation: SignedValdation) =>
    fetcher(`/v2/guilds/${id}/guild-platforms`, signedValdation)

  return useSubmitWithSign<GuildPlatform & { roleIds?: number[] }>(fetchData, {
    onError: (error) => {
      showErrorToast(error)
      captureEvent("useAddReward error", { ...postHogOptions, error })
    },
    onSuccess: (response) => {
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
