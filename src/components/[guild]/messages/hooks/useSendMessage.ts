import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import fetcher from "utils/fetcher"

export type MessageProtocol = "XMTP" | "WEB3INBOX"
export type MessageDestination = "GUILD" | "ADMINS" | "ROLES"

export type SendMessageForm = {
  protocol: MessageProtocol
  destination: MessageDestination
  roleIds: number[]
  message: string
}

const useSendMessage = (onSuccess?: () => void) => {
  const { id } = useGuild()

  const sendMessage = (signedValidation: SignedValdation) =>
    fetcher(`/v2/guilds/${id}/messages`, {
      ...signedValidation,
      method: "POST",
    })

  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  return useSubmitWithSign(sendMessage, {
    onSuccess: (response) => {
      toast({
        status: "success",
        title: "Successfully sent message!",
      })
      // TODO: mutate useMessages here
      console.log("RES", response)

      onSuccess?.()
    },
    onError: (error) => showErrorToast(error),
  })
}

export default useSendMessage
