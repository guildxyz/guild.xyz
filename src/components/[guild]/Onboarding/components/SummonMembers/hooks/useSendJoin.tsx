import { useRumAction, useRumError } from "@datadog/rum-react-integration"
import useGuild from "components/[guild]/hooks/useGuild"
import { useSubmitWithSign, WithValidation } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import fetcher from "utils/fetcher"
import { SummonMembersForm } from "../SummonMembers"

const useSendJoin = (onSuccess?: () => void) => {
  const addDatadogAction = useRumAction("trackingAppAction")
  const addDatadogError = useRumError()

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
      addDatadogError("Discord button send error", { error }, "custom")
    },
    onSuccess: () => {
      toast({ status: "success", title: "Join button sent!" })
      onSuccess?.()
      addDatadogAction("Successfully sent Discord button")
    },
  })

  return {
    ...useSubmitResponse,
    onSubmit: (data) =>
      useSubmitResponse.onSubmit({ ...data, serverId: platforms?.[0]?.platformId }),
  }
}

export default useSendJoin
