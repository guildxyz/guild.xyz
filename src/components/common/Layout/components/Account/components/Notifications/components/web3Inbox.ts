import { useToast } from "@chakra-ui/react"
import {
  initWeb3InboxClient,
  useNotifications,
  usePrepareRegistration,
  useRegister,
  useSubscribe,
  useSubscription,
  useWeb3InboxAccount,
} from "@web3inbox/react"
import useShowErrorToast from "hooks/useShowErrorToast"
import { useEffect, useState } from "react"
import { useAccount, useSignMessage } from "wagmi"

export const WEB3_INBOX_INIT_PARAMS = {
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  domain: "guild.xyz",
  allApps: process.env.NODE_ENV !== "production",
}

export const useWeb3InboxSubscription = () => {
  const [isSigningWeb3Inbox, setIsSigningWeb3Inbox] = useState(false)

  useEffect(() => {
    initWeb3InboxClient(WEB3_INBOX_INIT_PARAMS)
  }, [])

  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const { signMessageAsync } = useSignMessage()

  const { prepareRegistration, isLoading: isPreparing } = usePrepareRegistration()
  const { register, isLoading: isRegisteringWeb3Inbox } = useRegister()
  const { address, isConnecting, isReconnecting, status } = useAccount()
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
    isWeb3InboxLoading: isLoading || isPreparing || isW3iAccountLoading,
    web3InboxError: w3IAccountError ?? error,
    isRegisteringWeb3Inbox,
    isSigningWeb3Inbox,
    isSubscribingWeb3Inbox,
    subscribeWeb3Inbox,
  }
}

export const useGetWeb3InboxMessages = () => {
  const { address } = useAccount()
  const { data: account, isLoading: isAccountLoading } = useWeb3InboxAccount(
    address ? `eip155:1:${address}` : undefined
  )

  const { data: messages, isLoading } = useNotifications(
    5,
    false,
    account,
    WEB3_INBOX_INIT_PARAMS.domain
  )

  return { messages, isLoading: isLoading || isAccountLoading }
}
