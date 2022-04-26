import useGuild from "components/[guild]/hooks/useGuild"
import { useSubmitWithSign } from "hooks/useSubmit"
import { WithValidation } from "hooks/useSubmit/useSubmit"
import useToast from "hooks/useToast"
import fetcher from "utils/fetcher"
import { getFallbackMessageValues, SummonMembersForm } from "../SummonMembers"

const useSendJoin = (onSuccess?: () => void) => {
  const { platforms } = useGuild()

  const toast = useToast()

  const { name } = useGuild()

  const fallbackValues = getFallbackMessageValues(name)

  const sendJoin = ({ data, validation }: WithValidation<SummonMembersForm>) =>
    fetcher("/discord/sendJoin", {
      body: {
        ...data,
        serverId: platforms?.[0]?.platformId,
        title: data.title?.length > 0 ? data.title : fallbackValues.title,
        description:
          data.description?.length > 0
            ? data.description
            : fallbackValues.description,
        button: data.button?.length > 0 ? data.button : fallbackValues.button,
      },
      validation,
      method: "POST",
    })

  return useSubmitWithSign(sendJoin, {
    onError: () => {
      toast({ status: "error", title: "Falied to send join button" })
    },
    onSuccess: () => {
      toast({ status: "success", title: "Join button sent!" })
      onSuccess?.()
    },
  })
}

export default useSendJoin
