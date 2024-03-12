import { useYourGuilds } from "components/explorer/YourGuilds"
import useMembership from "components/explorer/hooks/useMembership"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import fetcher from "utils/fetcher"

type Response = any

const useLeaveGuild = () => {
  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const { mutate: mutateMembership } = useMembership()
  const { mutate: mutateYourGuilds } = useYourGuilds()

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
      mutateYourGuilds()
    },
    onError: (error) => showErrorToast(error),
  })
}

export default useLeaveGuild
