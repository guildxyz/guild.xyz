import useGuild from "components/[guild]/hooks/useGuild"
import processConnectorError from "components/[guild]/JoinModal/utils/processConnectorError"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import fetcher from "utils/fetcher"

const useSendJoin = (type: "JOIN" | "POAP", onSuccess?: () => void) => {
  const { mutateGuild } = useGuild()

  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  const sendJoin = (signedValidation: SignedValdation) =>
    fetcher("/discord/sendButton", {
      ...signedValidation,
      method: "POST",
    })

  const useSubmitResponse = useSubmitWithSign(sendJoin, {
    onError: (error) =>
      showErrorToast({
        error: processConnectorError(error.error) ?? error.error,
        correlationId: error.correlationId,
      }),
    onSuccess: () => {
      toast({
        status: "success",
        title: `${type === "JOIN" ? "Join" : "Claim"} button sent!`,
      })
      mutateGuild()
      onSuccess?.()
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
