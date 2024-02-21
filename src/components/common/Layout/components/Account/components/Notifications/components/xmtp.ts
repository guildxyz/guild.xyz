import { useToast } from "@chakra-ui/react"
import { Client, useCanMessage } from "@xmtp/react-sdk"
import useUser from "components/[guild]/hooks/useUser"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
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
  const [hasXmtpAccess, setHasAccess] = useState<boolean>(false)
  const [isCheckingXmtpAccess, setIsCheckingAccess] = useState(false)
  const { canMessageStatic } = useCanMessage()
  const showErrorToast = useShowErrorToast()

  const { address } = useAccount()

  useEffect(() => {
    if (address) {
      setIsCheckingAccess(true)
      canMessageStatic(address)
        .then(setHasAccess)
        .catch((e) => {
          console.error("XmtpAccessCheckingError", e)
          showErrorToast("Error happened during checking XMTP access")
        })
        .finally(() => setIsCheckingAccess(false))
    }
  }, [address, canMessageStatic])
  return {
    hasXmtpAccess,
    isCheckingXmtpAccess,
  }
}

export const useSubscribeToXMTP = () => {
  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  const { data: signer } = useWalletClient()

  const subscribeToXMTP = async () => {
    await Client.create(signer, {
      persistConversations: false,
      env: "production",
    })
  }

  const { error, isLoading } = useSubmit(subscribeToXMTP, {
    onError: (error) => {
      console.error("XMTPSubscribeError", error)
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
