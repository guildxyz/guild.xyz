import useGuild from "components/[guild]/hooks/useGuild"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import fetcher from "utils/fetcher"
import useMessages, { Message } from "./useMessages"

const useSendMessage = (onSuccess?: () => void) => {
  const { id } = useGuild()

  const sendMessage = (signedValidation: SignedValdation) =>
    fetcher(`/v2/guilds/${id}/messages`, {
      ...signedValidation,
      method: "POST",
    })

  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  const { mutate: mutateMessages } = useMessages()

  return useSubmitWithSign<{ job: { id: string }; message: Message }>(sendMessage, {
    onSuccess: (response) => {
      toast({
        status: "success",
        title: "Successfully sent message!",
      })

      mutateMessages((prev) => [response.message, ...prev], { revalidate: false })

      onSuccess?.()
    },
    onError: (error) => showErrorToast(error),
  })
}

export default useSendMessage
