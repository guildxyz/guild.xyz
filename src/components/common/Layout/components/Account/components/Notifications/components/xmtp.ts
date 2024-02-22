import { Client, useCanMessage } from "@xmtp/react-sdk"
import useUser from "components/[guild]/hooks/useUser"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useEffect, useState } from "react"
import { useFetcherWithSign } from "utils/fetcher"
import { useAccount, useWalletClient } from "wagmi"

export const useUsersXMTPKeys = () => {
  const fetcherWithSign = useFetcherWithSign()
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const { id, error: userError, isLoading: isUserLoading } = useUser()

  useEffect(() => {
    if (id) {
      setIsLoading(true)
      fetcherWithSign([
        id ? `/v2/users/${id}/keys` : null,
        {
          method: "GET",
          body: {
            Accept: "application/json",
            query: { service: "XMTP" },
          },
        },
      ])
        .then((response) => {
          setData(response)
        })
        .catch(setError)
        .finally(() => {
          setIsLoading(true)
        })
    }
  }, [id])

  return {
    keys: data?.keys,
    isLoading: isUserLoading || isLoading,
    error: userError && error,
  }
}

export const useXmtpAccessChecking = () => {
  const { canMessageStatic } = useCanMessage()
  const showErrorToast = useShowErrorToast()

  const { address } = useAccount()

  const { error, isLoading, onSubmit, reset, response } = useSubmit(
    async () => canMessageStatic(address),
    {
      onError: () => showErrorToast("Error happened during checking XMTP access"),
    }
  )
  return {
    error,
    isCheckingAccess: isLoading,
    reCheck: onSubmit,
    reset,
    hasAccess: response,
  }
}

export const useSubscribeToXMTP = (onSuccess: () => void) => {
  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  const { data: signer } = useWalletClient()

  const subscribeToXMTP = async () => {
    await Client.create(signer, {
      persistConversations: false,
      env: "production",
    }).then(() => onSuccess())
  }

  const { error, isLoading } = useSubmit(subscribeToXMTP, {
    onError: (error) => {
      showErrorToast("Couldn't subscribe to Guild messages")
    },
    onSuccess: () =>
      toast({
        status: "success",
        title: "Success",
        description: "Successfully subscribed to Guild messages via XMTP",
      }),
  })
  return { subscribeToXmtp: onsubmit, isSubscribing: isLoading, error }
}
