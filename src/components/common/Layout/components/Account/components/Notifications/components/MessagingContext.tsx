import { useToast } from "@chakra-ui/react"
import {
  initWeb3InboxClient,
  usePrepareRegistration,
  useRegister,
  useSubscribe,
  useSubscription,
  useWeb3InboxAccount,
} from "@web3inbox/react"
import { Client, useClient } from "@xmtp/react-sdk"
import useUser from "components/[guild]/hooks/useUser"
import useShowErrorToast from "hooks/useShowErrorToast"
import { createContext, useCallback, useContext, useEffect, useState } from "react"
import useSWRImmutable from "swr/immutable"
import { useFetcherWithSign } from "utils/fetcher"
import { useAccount, useSignMessage, useWalletClient } from "wagmi"

type XmtpSubscription = {
  IsXmtpLoading: boolean
  xmtpSubscription: any
  xmtpError: any
  isSubscribingXmtp: boolean
  subscribeXmtp: () => Promise<void>
}
type SubscribeWeb3Inbox = {
  isRegisteringWeb3Inbox: boolean
  isSigningWeb3Inbox: boolean
  isSubscribingWeb3Inbox: boolean
  subscribeWeb3Inbox: () => Promise<void>
}
type Web3InboxSubscription = {
  IsWeb3InboxLoading: boolean
  web3InboxError: any
  web3InboxSubscription: any
} & SubscribeWeb3Inbox

export const WEB3_INBOX_INIT_PARAMS = {
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  domain: "guild.xyz",
  allApps: process.env.NODE_ENV !== "production",
}

const messagingContext = createContext<
  XmtpSubscription & Web3InboxSubscription & SubscribeWeb3Inbox
>({
  IsWeb3InboxLoading: true,
  web3InboxError: undefined,
  web3InboxSubscription: undefined,
  IsXmtpLoading: true,
  xmtpError: undefined,
  xmtpSubscription: undefined,
  isRegisteringWeb3Inbox: false,
  isSigningWeb3Inbox: false,
  isSubscribingWeb3Inbox: false,
  subscribeWeb3Inbox: undefined,
  isSubscribingXmtp: false,
  subscribeXmtp: undefined,
})

export const useMessagingContext = () => useContext(messagingContext)

const useWeb3InboxSubscription = (): Web3InboxSubscription => {
  useEffect(() => {
    initWeb3InboxClient(WEB3_INBOX_INIT_PARAMS)
  }, [])

  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const { signMessageAsync } = useSignMessage()

  const [isSigningWeb3Inbox, setIsSigningWeb3Inbox] = useState(false)

  const { prepareRegistration, isLoading: isPreparing } = usePrepareRegistration()
  const { register, isLoading: isRegisteringWeb3Inbox } = useRegister()

  const { address, isConnecting, isReconnecting, status } = useAccount()
  console.log("%c useAccount", "color: brown", isConnecting, isReconnecting, status)
  const {
    data: w3IAccount,
    error: w3IAccountError,
    isLoading: isW3iAccountLoading,
  } = useWeb3InboxAccount(address ? `eip155:1:${address}` : undefined)
  const {
    data: subscription,
    error,
    isLoading,
  } = useSubscription(w3IAccount, WEB3_INBOX_INIT_PARAMS.domain)
  const { subscribe, isLoading: isSubscribingWeb3Inbox } = useSubscribe(
    w3IAccount,
    WEB3_INBOX_INIT_PARAMS.domain
  )

  const subscribeWeb3Inbox = async () => {
    if (!address) return

    try {
      const { message, registerParams } = await prepareRegistration()
      setIsSigningWeb3Inbox(true)
      const signature = await signMessageAsync({ message: message }).finally(() =>
        setIsSigningWeb3Inbox(false)
      )
      await register({ registerParams, signature })
    } catch (web3InboxRegisterError) {
      console.error("web3InboxRegisterError", web3InboxRegisterError)
      showErrorToast("Web3Inbox registration error")
      return
    }

    try {
      await subscribe()
      toast({
        status: "success",
        title: "Success",
        description: "Successfully subscribed to Guild messages via Web3Inbox",
      })
    } catch (web3InboxSubscribeError) {
      console.error("web3InboxSubscribeError", web3InboxSubscribeError)
      showErrorToast("Couldn't subscribe to Guild messages")
    }
  }

  return {
    web3InboxSubscription: subscription,
    IsWeb3InboxLoading: isLoading || isPreparing || isW3iAccountLoading,
    web3InboxError: w3IAccountError ?? error,
    isRegisteringWeb3Inbox,
    isSigningWeb3Inbox,
    isSubscribingWeb3Inbox,
    subscribeWeb3Inbox,
  }
}

const useXmtpSubscription = (): XmtpSubscription => {
  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const fetcherWithSign = useFetcherWithSign()

  const [isSubscribing, setIsSubscribing] = useState(false)

  const { id, error: userError, isLoading: isUserLoading } = useUser()
  const { initialize, isLoading: isClientLoading } = useClient()
  const { data: signer, isLoading: isWalletClientLoading } = useWalletClient()

  const {
    data: xmtpSubscription,
    error,
    isLoading,
    mutate: refreshXmtpSubscription,
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

  const subscribeXmtp = useCallback(async () => {
    setIsSubscribing(true)
    try {
      await initialize({
        options: {
          persistConversations: false,
          env: "dev",
        },
        signer,
      })
      const key = await Client.getKeys(signer)

      await fetcherWithSign([
        `/v2/users/${id}/keys`,
        {
          body: {
            key: Buffer.from(key).toString("binary"),
            service: "XMTP",
          },
        },
      ])
      console.log("refreshXmtpSubscription")

      refreshXmtpSubscription()
      toast({
        status: "success",
        title: "Success",
        description: "Successfully subscribed to Guild messages via Web3Inbox",
      })
    } catch (error) {
      console.error("web3InboxSubscribeError", error)
      showErrorToast("Couldn't subscribe to Guild messages")
    } finally {
      setIsSubscribing(false)
    }
  }, [initialize, signer, id])

  return {
    xmtpSubscription,
    IsXmtpLoading:
      isLoading || isUserLoading || isClientLoading || isWalletClientLoading,
    xmtpError: error ?? userError,
    isSubscribingXmtp: isSubscribing,
    subscribeXmtp,
  }
}

export const MessagingWrapper = ({ children }) => {
  const {
    IsWeb3InboxLoading,
    web3InboxError,
    web3InboxSubscription,
    isRegisteringWeb3Inbox,
    isSigningWeb3Inbox,
    isSubscribingWeb3Inbox,
    subscribeWeb3Inbox,
  } = useWeb3InboxSubscription()

  const {
    IsXmtpLoading,
    xmtpError,
    xmtpSubscription,
    isSubscribingXmtp,
    subscribeXmtp,
  } = useXmtpSubscription()

  return (
    <messagingContext.Provider
      value={{
        IsWeb3InboxLoading,
        web3InboxError,
        web3InboxSubscription,
        IsXmtpLoading,
        xmtpError,
        xmtpSubscription,
        isRegisteringWeb3Inbox,
        isSigningWeb3Inbox,
        isSubscribingWeb3Inbox,
        subscribeWeb3Inbox,
        isSubscribingXmtp,
        subscribeXmtp,
      }}
    >
      {children}
    </messagingContext.Provider>
  )
}
