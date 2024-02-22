import { Client } from "@xmtp/react-sdk"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useWalletClient } from "wagmi"

export const useSubscribeToXMTP = (onSuccess: () => void) => {
  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  const { data: signer } = useWalletClient()

  const subscribeToXMTP = () =>
    Client.create(signer, {
      persistConversations: false,
      env: "production",
    }).then(() => onSuccess())

  const { error, isLoading, onSubmit } = useSubmit(subscribeToXMTP, {
    onError: () => {
      showErrorToast("Couldn't subscribe to Guild messages")
    },
    onSuccess: () =>
      toast({
        status: "success",
        title: "Success",
        description: "Successfully subscribed to Guild messages via XMTP",
      }),
  })
  return { subscribe: onSubmit, isSubscribing: isLoading, error }
}
