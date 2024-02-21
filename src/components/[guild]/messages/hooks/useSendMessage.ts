import { Client } from "@xmtp/react-sdk"
import useGuild from "components/[guild]/hooks/useGuild"
import useUser from "components/[guild]/hooks/useUser"
import { useGetXmtpKeys } from "components/common/Layout/components/Account/components/Notifications/components/xmtp"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import fetcher, { useFetcherWithSign } from "utils/fetcher"
import { useWalletClient } from "wagmi"
import useGuildMessages, { Message } from "./useGuildMessages"

const useSendMessage = (onSuccess?: () => void) => {
  const { id } = useGuild()
  const { keys: xmtpKeys } = useGetXmtpKeys()
  const fetcherWithSign = useFetcherWithSign()
  const { data: signer } = useWalletClient()

  const { id: userId } = useUser()

  const sendMessage = (signedValidation: SignedValidation) => {
    const formValues = JSON.parse(signedValidation.signedPayload)

    if (formValues.protocol === "WEB3INBOX" || xmtpKeys.length) {
      return fetcher(`/v2/guilds/${id}/messages`, {
        ...signedValidation,
        method: "POST",
      })
    } else {
      return Client.getKeys(signer, { env: "production" })
        .then((rawKey) => Buffer.from(rawKey).toString("binary"))
        .then(
          async (key) =>
            await fetcherWithSign([
              userId ? `/v2/users/${userId}/keys` : undefined,
              {
                body: {
                  key: key,
                  service: "XMTP",
                },
              },
            ])
        )
        .then(() =>
          fetcher(`/v2/guilds/${id}/messages`, {
            ...signedValidation,
            method: "POST",
          })
        )
    }
  }

  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  const { mutate: mutateMessages } = useGuildMessages()

  return useSubmitWithSign<{ job: { id: string }; message: Message }>(sendMessage, {
    onSuccess: (response) => {
      toast({
        status: "success",
        title: "Successfully sent message!",
      })

      mutateMessages((prev) => [response.message, ...prev], {
        revalidate: false,
      })

      // Refetching after 5s, to update its status
      setTimeout(() => mutateMessages(), 5000)

      onSuccess?.()
    },
    onError: (error) => showErrorToast(error),
  })
}

export default useSendMessage
