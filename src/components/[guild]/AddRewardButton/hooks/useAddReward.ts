import useGuild from "components/[guild]/hooks/useGuild"
import { usePostHogContext } from "components/_app/PostHogProvider"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { GuildPlatform } from "types"
import fetcher from "utils/fetcher"

const useAddReward = (onSuccess?) => {
  const { id, urlName, mutateGuild } = useGuild()

  const { captureEvent } = usePostHogContext()
  const postHogOptions = { guild: urlName }

  const showErrorToast = useShowErrorToast()
  const toast = useToast()

  const fetchData = async (signedValdation: SignedValdation) =>
    fetcher(`/v2/guilds/${id}/guild-platforms`, signedValdation)

  return useSubmitWithSign<GuildPlatform & { roleIds?: number[] }>(fetchData, {
    onError: (err) => {
      showErrorToast(err)
      captureEvent("useAddReward error", { ...postHogOptions, error: err })
    },
    onSuccess: () => {
      toast({ status: "success", title: "Reward successfully added" })
      mutateGuild()
      onSuccess?.()
    },
  })
}

export default useAddReward
