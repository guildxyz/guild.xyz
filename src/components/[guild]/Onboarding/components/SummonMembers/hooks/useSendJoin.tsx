import useGuild from "components/[guild]/hooks/useGuild"
import processConnectorError from "components/[guild]/JoinModal/utils/processConnectorError"
import useDatadog from "components/_app/Datadog/useDatadog"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import fetcher from "utils/fetcher"

const useSendJoin = (type: "JOIN" | "POAP", onSuccess?: () => void) => {
  const { addDatadogAction, addDatadogError } = useDatadog()

  const { mutateGuild } = useGuild()

  const toast = useToast()

  const sendJoin = (signedValidation: SignedValdation) =>
    fetcher("/discord/sendButton", {
      ...signedValidation,
      method: "POST",
    })

  const useSubmitResponse = useSubmitWithSign(sendJoin, {
    onError: (error) => {
      const simpleError = error?.errors?.[0]?.msg
      const processedError = processConnectorError(error)

      toast({
        status: "error",
        title: `Failed to send ${type === "JOIN" ? "join" : "mint"} button`,
        description: simpleError ?? processedError,
      })

      if (type === "JOIN") addDatadogError("Discord button send error", { error })
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
