import { Icon, IconButton, useDisclosure } from "@chakra-ui/react"
import { Modal } from "components/common/Modal"
import { Gear } from "phosphor-react"
import SubscriptionPromptSkeleton from "../MessageSkeleton/SubscriptionPromptSkeleton"
import { SubscriptionModalContent } from "./SubscribeModalContent"
import { SubscriptionPrompt } from "./SubscriptionPrompt"
import { MessagingWrapper, useMessagingContext } from "./components/MessagingContext"
import NotificationsSection from "./components/NotificationsSection"

const MessagingSection = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isWeb3InboxLoading: isWeb3InboxLoading,
    web3InboxSubscription,
    isXmtpLoading,
    hasXmtpAccess,
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
        {(isWeb3InboxLoading || isXmtpLoading) && <SubscriptionPromptSkeleton />}
        {!web3InboxSubscription && !hasXmtpAccess && (
          <SubscriptionPrompt onClick={onOpen} />
        )}
      </NotificationsSection>
      <Modal {...{ isOpen, onClose }}>
        <SubscriptionModalContent onClose={onclose} />
      </Modal>
    </>
  )
}

export default () => (
  <MessagingWrapper>
    <MessagingSection />
  </MessagingWrapper>
)
