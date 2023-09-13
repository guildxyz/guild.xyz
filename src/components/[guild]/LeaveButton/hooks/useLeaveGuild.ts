import useMemberships from "components/explorer/hooks/useMemberships"
import useGuild from "components/[guild]/hooks/useGuild"
import useMatchMutate from "hooks/useMatchMutate"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import fetcher from "utils/fetcher"

type Response = any

const useLeaveGuild = () => {
  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const matchMutate = useMatchMutate()
  const { mutate } = useMemberships()
  const { id } = useGuild()

  const submit = (signedValidation: SignedValdation): Promise<Response> =>
    fetcher(`/user/leaveGuild`, signedValidation)

  return useSubmitWithSign<Response>(submit, {
    onSuccess: () => {
      toast({
        title: "You've successfully left this guild",
        status: "success",
      })

      mutate((prev) => prev.filter(({ guildId }) => guildId !== id), {
        revalidate: false,
      })
      matchMutate(/^\/guild\/address\//)
    },
    onError: (error) => showErrorToast(error),
  })
}

export default useLeaveGuild
