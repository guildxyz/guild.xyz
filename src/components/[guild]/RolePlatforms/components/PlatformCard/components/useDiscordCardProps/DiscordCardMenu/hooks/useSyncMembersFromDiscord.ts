import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import { mutate } from "swr"
import fetcher from "utils/fetcher"

const useSyncMembersFromDiscord = () => {
  const showErrorToast = useShowErrorToast()
  const { id } = useGuild()

  const syncMembersFromDiscord = async (signedValidation: SignedValdation) =>
    fetcher(`/statusUpdate/guildify/${id}`, signedValidation)

  const { onSubmit, ...rest } = useSubmitWithSign(syncMembersFromDiscord, {
    onSuccess: () => mutate(`/statusUpdate/guild/${id}`),
    onError: (err) => showErrorToast(err),
  })

  return {
    ...rest,
    triggerSync: () =>
      onSubmit({
        notifyUsers: false,
      }),
  }
}

export default useSyncMembersFromDiscord
