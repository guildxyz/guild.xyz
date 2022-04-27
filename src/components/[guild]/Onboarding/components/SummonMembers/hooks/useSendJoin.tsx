import useGuild from "components/[guild]/hooks/useGuild"
import { useSubmitWithSign } from "hooks/useSubmit"
import { WithValidation } from "hooks/useSubmit/useSubmit"
import useToast from "hooks/useToast"
import fetcher from "utils/fetcher"
import { SummonMembersForm } from "../SummonMembers"

const useSendJoin = (onSuccess?: () => void) => {
  const { platforms } = useGuild()

  const toast = useToast()

  const sendJoin = ({ data, validation }: WithValidation<SummonMembersForm>) =>
    fetcher("/discord/sendJoin", {
      body: {
        ...data,
        serverId: platforms?.[0]?.platformId,
      },
      validation,
      method: "POST",
    })

  return useSubmitWithSign(sendJoin, {
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
}

export default useSendJoin
