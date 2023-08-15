import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { GuildPlatform } from "types"
import fetcher from "utils/fetcher"

// TODO: add types

const useAddReward = (onSuccess?) => {
  const { id, mutateGuild } = useGuild()
  const showErrorToast = useShowErrorToast()
  const toast = useToast()

  const fetchData = async (signedValdation: SignedValdation) =>
    fetcher(`/guild/${id}/platform`, signedValdation)

  return useSubmitWithSign<GuildPlatform & { roleIds?: number[] }>(fetchData, {
    onError: (err) => showErrorToast(err),
    onSuccess: () => {
      toast({ status: "success", title: "Reward successfully added" })
      mutateGuild()
      onSuccess?.()
    },
  })
}

export default useAddReward
