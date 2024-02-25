import { Client } from "@xmtp/react-sdk"
import useGuild from "components/[guild]/hooks/useGuild"
import useUser from "components/[guild]/hooks/useUser"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import useSWR from "swr"
import { useFetcherWithSign } from "utils/fetcher"
import { useWalletClient } from "wagmi"
import { SendMessageForm } from "../SendNewMessage/SendNewMessage"
import useGuildMessages, { Message } from "./useGuildMessages"

const useSendMessage = (onSuccess?: () => void) => {
  const { id } = useGuild()
  const fetcherWithSign = useFetcherWithSign()
  const { id: userId } = useUser()

  const { data: xmtpKeys } = useSWR(
    userId ? `/v2/users/${userId}/keys` : null,
    (url: string) =>
      fetcherWithSign([
        url,
        {
          method: "GET",
          body: {
            Accept: "application/json",
            query: { service: "XMTP" },
          },
        },
      ])
  )
  const { data: signer } = useWalletClient()

  const sendMessage = (formValues: SendMessageForm) => {
    if (formValues.protocol === "WEB3INBOX" || xmtpKeys.length) {
      return fetcherWithSign([
        `/v2/guilds/${id}/messages`,
        {
          body: formValues,
          method: "POST",
        },
      ])
    } else {
      return Client.getKeys(signer, { env: "production" })
        .then((rawKey) => Buffer.from(rawKey).toString("binary"))
        .then(async (key) =>
          fetcherWithSign([
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
          fetcherWithSign([
            `/v2/guilds/${id}/messages`,
            {
              body: formValues,
              method: "POST",
            },
          ])
        )
    }
  }

  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  const { mutate: mutateMessages } = useGuildMessages()

  return useSubmit<SendMessageForm, { job: { id: string }; message: Message }>(
    sendMessage,
    {
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
    }
  )
}

export default useSendMessage
