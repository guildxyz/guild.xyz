import useGuild from "components/[guild]/hooks/useGuild"
import { useYourGuilds } from "components/explorer/YourGuilds"
import useMembership from "components/explorer/hooks/useMembership"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import fetcher from "utils/fetcher"

type Response = any

const useLeaveGuild = (onSuccess?: () => void) => {
  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const { mutate: mutateMembership } = useMembership()
  const { mutate: mutateYourGuilds } = useYourGuilds()

  /**
   * Since we have a leave button only on the guild page, it's safe to retrieve the
   * Guild ID from the useGuild hook instead of the params passed to onSubmit
   */
  const { id } = useGuild()

  const submit = (signedValidation: SignedValidation): Promise<Response> =>
    fetcher(`/user/leaveGuild`, signedValidation)

  return useSubmitWithSign<Response>(submit, {
    onSuccess: () => {
      toast({
        title: "You've successfully left this guild",
        status: "success",
      })

      mutateMembership(undefined, {
        revalidate: false,
      })
      mutateYourGuilds(
        (prevValue) => prevValue?.filter((guild) => guild.id !== id),
        { revalidate: false }
      )

      onSuccess?.()
    },
    onError: (error) => showErrorToast(error),
  })
}

export default useLeaveGuild
