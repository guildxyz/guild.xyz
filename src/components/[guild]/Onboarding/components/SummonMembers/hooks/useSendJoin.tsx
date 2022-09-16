import { useRumAction, useRumError } from "@datadog/rum-react-integration"
import useGuild from "components/[guild]/hooks/useGuild"
import { useSubmitWithSign, WithValidation } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import fetcher from "utils/fetcher"
import { SummonMembersForm } from "../SummonMembers"

const useSendJoin = (type: "JOIN" | "POAP", onSuccess?: () => void) => {
  const addDatadogAction = useRumAction("trackingAppAction")
  const addDatadogError = useRumError()
  const { mutateGuild } = useGuild()

  const toast = useToast()

  const sendJoin = ({ data: body, validation }: WithValidation<SummonMembersForm>) =>
    fetcher("/discord/sendButton", {
      body,
      validation,
      method: "POST",
    })

  const useSubmitResponse = useSubmitWithSign(sendJoin, {
    onError: (error) => {
      toast({
        status: "error",
        title: `Failed to send ${type === "JOIN" ? "join" : "claim"} button`,
        description: error?.errors?.[0]?.msg,
      })

      if (type === "JOIN")
        addDatadogError("Discord button send error", { error }, "custom")
    },
    onSuccess: () => {
      toast({
        status: "success",
        title: `${type === "JOIN" ? "Join" : "Claim"} button sent!`,
      })
      mutateGuild()
      onSuccess?.()
      if (type === "JOIN") addDatadogAction("Successfully sent Discord button")
    },
  })

  return {
    ...useSubmitResponse,
    onSubmit: (data) =>
      useSubmitResponse.onSubmit({
        ...data,
        isJoinButton: type === "JOIN",
      }),
  }
}

export default useSendJoin
