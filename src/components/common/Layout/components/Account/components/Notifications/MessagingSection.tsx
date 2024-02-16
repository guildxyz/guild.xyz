import { Icon, IconButton, useDisclosure } from "@chakra-ui/react"
import { XMTPProvider } from "@xmtp/react-sdk"
import dynamic from "next/dynamic"
import { Gear } from "phosphor-react"
import SubscriptionPromptSkeleton from "../MessageSkeleton/SubscriptionPromptSkeleton"
import { SubscriptionPrompt } from "./SubscriptionPrompt"
import { MessagingWrapper, useMessagingContext } from "./components/MessagingContext"
import NotificationsSection from "./components/NotificationsSection"

const Messages = dynamic(() => import("./Messages"))
const DynamicMessagingSubscriptionModal = dynamic(
  () => import("./MessageSubscriptionModal")
)

const MessagingSection = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isCheckingXmtpAccess,
    hasXmtpAccess,
    isWeb3InboxLoading,
    web3InboxSubscription,
  } = useMessagingContext()

  return (
    <>
      <NotificationsSection
        title={
          <>
            Messages
            <IconButton
              aria-label="messagingSettings"
              icon={<Icon as={Gear} boxSize="1.1em" />}
              variant={"ghost"}
              borderRadius={"full"}
              ml={1}
              onClick={onOpen}
            />
          </>
        }
      >
        {isWeb3InboxLoading || isCheckingXmtpAccess ? (
          <SubscriptionPromptSkeleton />
        ) : !web3InboxSubscription && !hasXmtpAccess ? (
          <SubscriptionPrompt onClick={onOpen} />
        ) : (
          <Messages />
        )}
      </NotificationsSection>
      <DynamicMessagingSubscriptionModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}

export default () => (
  <XMTPProvider>
    <MessagingWrapper>
      <MessagingSection />
    </MessagingWrapper>
  </XMTPProvider>
)
