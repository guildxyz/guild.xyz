import useGuild from "components/[guild]/hooks/useGuild"
import { useSubmitWithSign } from "hooks/useSubmit"
import { WithValidation } from "hooks/useSubmit/useSubmit"
import useToast from "hooks/useToast"
import fetcher from "utils/fetcher"
import { SummonMembersForm } from "../SummonMembers"

const useSendJoin = (onSuccess?: () => void) => {
  const { platforms } = useGuild()

  const toast = useToast()

  const sendJoin = ({ data: body, validation }: WithValidation<SummonMembersForm>) =>
    fetcher("/discord/sendJoin", {
      body,
      validation,
      method: "POST",
    })

  const useSubmitResponse = useSubmitWithSign(sendJoin, {
    onError: (error) => {
      toast({
        status: "error",
        title: "Falied to send join button",
        description: error?.errors?.[0]?.msg,
      })
    },
    onSuccess: () => {
      toast({ status: "success", title: "Join button sent!" })
      onSuccess?.()
    },
  })

  return {
    ...useSubmitResponse,
    onSubmit: (data) =>
      useSubmitResponse.onSubmit({ ...data, serverId: platforms?.[0]?.platformId }),
  }
}

export default useSendJoin
