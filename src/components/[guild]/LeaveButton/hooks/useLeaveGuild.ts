import { useYourGuilds } from "components/explorer/YourGuilds"
import useMembership from "components/explorer/hooks/useMembership"
import useMatchMutate from "hooks/useMatchMutate"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import fetcher from "utils/fetcher"

type Response = any

const useLeaveGuild = () => {
  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const matchMutate = useMatchMutate()
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
      matchMutate(/^\/guild\/address\//)
      mutateYourGuilds()
    },
    onError: (error) => showErrorToast(error),
  })
}

export default useLeaveGuild
