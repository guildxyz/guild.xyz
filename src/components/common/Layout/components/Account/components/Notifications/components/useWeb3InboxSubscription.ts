import { useToast } from "@chakra-ui/react"
import {
  initWeb3InboxClient,
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

const useWeb3InboxSubscription = () => {
  const [isSigning, setIsSigning] = useState(false)

  useEffect(() => {
    initWeb3InboxClient(WEB3_INBOX_INIT_PARAMS)
  }, [])

  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const { signMessageAsync } = useSignMessage()

  const { prepareRegistration, isLoading: isPreparing } = usePrepareRegistration()
  const { register, isLoading: isRegistering } = useRegister()
  const { address } = useAccount()
  const {
    data: account,
    error: accountError,
    isLoading: isAccountLoading,
  } = useWeb3InboxAccount(address ? `eip155:1:${address}` : undefined)
  const {
    data: subscriptionStatus,
    error,
    isLoading,
  } = useSubscription(account, WEB3_INBOX_INIT_PARAMS.domain)
  const { subscribe, isLoading: isSubscribing } = useSubscribe(
    account,
    WEB3_INBOX_INIT_PARAMS.domain
  )

  const handleSubscribe = async () => {
    if (!address) return

    try {
      const { message, registerParams } = await prepareRegistration()
      setIsSigning(true)
      const signature = await signMessageAsync({ message: message }).finally(() =>
        setIsSigning(false)
      )
      await register({ registerParams, signature })
    } catch (web3InboxRegisterError) {
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
    } catch (subscribeError) {
      showErrorToast("Couldn't subscribe to Guild messages")
    }
  }

  return {
    subscriptionStatus,
    isLoading: isLoading || isPreparing || isAccountLoading,
    error: accountError ?? error,
    isRegistering,
    isSigning,
    isSubscribing,
    subscribe: handleSubscribe,
  }
}

export default useWeb3InboxSubscription
