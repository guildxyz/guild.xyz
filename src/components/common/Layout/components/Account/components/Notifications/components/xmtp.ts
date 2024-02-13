import { useToast } from "@chakra-ui/react"
import { Client, useCanMessage } from "@xmtp/react-sdk"
import useUser from "components/[guild]/hooks/useUser"
import useShowErrorToast from "hooks/useShowErrorToast"
import { useCallback, useEffect, useState } from "react"
import useSWRImmutable from "swr/immutable"
import { useFetcherWithSign } from "utils/fetcher"
import { useAccount, useWalletClient } from "wagmi"

export const useSaveXmtpKeys = () => {
  const fetcherWithSign = useFetcherWithSign()
  const { data: signer, isLoading: isWalletClientLoading } = useWalletClient()
  const { id, error: userError, isLoading: isUserLoading } = useUser()

  const saveXmtpKeys = useCallback(
    async () =>
      Client.getKeys(signer).then(async (key) => {
        await fetcherWithSign([
          id ? `/v2/users/${id}/keys` : undefined,
          {
            body: {
              key: Buffer.from(key).toString("binary"),
              service: "XMTP",
            },
          },
        ])
      }),
    [id, signer]
  )
  return saveXmtpKeys
}

export const useGetXmtpKeys = () => {
  const fetcherWithSign = useFetcherWithSign()
  const { id, error: userError, isLoading: isUserLoading } = useUser()

  const {
    data: keys,
    error,
    isLoading,
  } = useSWRImmutable(
    [
      id ? `/v2/users/${id}/keys` : null,
      {
        method: "GET",
        body: {
          Accept: "application/json",
          query: { service: "XMTP" },
        },
      },
    ],
    fetcherWithSign
  )
  return { keys, isLoading: isUserLoading || isLoading, error: userError && error }
}

export const useXmtpAccessChecking = () => {
  const [hasAccess, setHasAccess] = useState<boolean>(false)
  const [isCheckingAccess, setIsCheckingAccess] = useState(false)
  const [timestamp, refresh] = useState(new Date())
  const { canMessageStatic, error, isLoading } = useCanMessage()
  const showErrorToast = useShowErrorToast()

  const { address } = useAccount()

  useEffect(() => {
    if (address) {
      setIsCheckingAccess(true)
      canMessageStatic(address).then((response) =>
        console.log("canMessageStatic ", response)
      )
      canMessageStatic(address)
        .then(setHasAccess)
        .catch((e) => {
          console.error("XmtpAccessCheckingError", e)
          showErrorToast("Error happened during checking XMTP access")
        })
        .finally(() => setIsCheckingAccess(false))
    }
  }, [address])
  return {
    hasAccess,
    isCheckingAccess,
    timestamp,
    refresh: () => refresh(new Date()),
  }
}

export const useSubscribeXmtp = (onAfterSubscription: Function) => {
  const [isSubscribingXmtp, setIsSubscribingXmtp] = useState<boolean>(false)

  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const { data: signer, isLoading } = useWalletClient()

  const subscribeXmtp = useCallback(async () => {
    setIsSubscribingXmtp(true)
    try {
      await Client.create(signer, {
        persistConversations: false,
        env: "dev",
      }).then((client) => {
        console.log("%c xmtpClient", "color: green", client)
      })
      onAfterSubscription()
      toast({
        status: "success",
        title: "Success",
        description: "Successfully subscribed to Guild messages via Web3Inbox",
      })
    } catch (error) {
      console.error("web3InboxSubscribeError", error)
      showErrorToast("Couldn't subscribe to Guild messages")
    } finally {
      setIsSubscribingXmtp(false)
    }
  }, [signer])

  return {
    isLoadingDependencies: isLoading,
    subscribeXmtp,
    isSubscribingXmtp,
  }
}
