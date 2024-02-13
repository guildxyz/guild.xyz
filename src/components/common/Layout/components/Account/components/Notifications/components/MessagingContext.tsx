import { createContext, useContext } from "react"
import { useWeb3InboxSubscription } from "./web3Inbox"
import { useSubscribeXmtp, useXmtpAccessChecking } from "./xmtp"

type XmtpSubscription = {
  isXmtpLoading: boolean
  hasXmtpAccess: boolean
  isSubscribingXmtp: boolean
  subscribeXmtp: () => Promise<void>
}
export type SubscribeWeb3Inbox = {
  isRegisteringWeb3Inbox: boolean
  isSigningWeb3Inbox: boolean
  isSubscribingWeb3Inbox: boolean
  isWeb3InboxLoading: boolean
  web3InboxError: any
  web3InboxSubscription: any
  subscribeWeb3Inbox: () => Promise<void>
}

const messagingContext = createContext<
  XmtpSubscription & SubscribeWeb3Inbox & SubscribeWeb3Inbox
>({
  isWeb3InboxLoading: true,
  web3InboxError: undefined,
  web3InboxSubscription: undefined,
  isXmtpLoading: true,
  hasXmtpAccess: false,
  isRegisteringWeb3Inbox: false,
  isSigningWeb3Inbox: false,
  isSubscribingWeb3Inbox: false,
  subscribeWeb3Inbox: undefined,
  isSubscribingXmtp: false,
  subscribeXmtp: undefined,
})

export const useMessagingContext = () => useContext(messagingContext)

export const MessagingWrapper = ({ children }) => {
  const web3InboxSubscription = useWeb3InboxSubscription()
  const { hasAccess, isCheckingAccess, refresh } = useXmtpAccessChecking()

  const { isLoadingDependencies, isSubscribingXmtp, subscribeXmtp } =
    useSubscribeXmtp(refresh)

  return (
    <messagingContext.Provider
      value={{
        ...web3InboxSubscription,
        isSubscribingXmtp,
        isXmtpLoading: isLoadingDependencies || isCheckingAccess,
        hasXmtpAccess: hasAccess,
        subscribeXmtp,
      }}
    >
      {children}
    </messagingContext.Provider>
  )
}
