import {
  Divider,
  HStack,
  Icon,
  IconButton,
  Link,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import { XMTPProvider } from "@xmtp/react-sdk"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import dynamic from "next/dynamic"
import { ArrowSquareOut, Gear } from "phosphor-react"
import SubscriptionPromptSkeleton from "../MessageSkeleton/SubscriptionPromptSkeleton"
import { SubscriptionPrompt } from "./SubscriptionPrompt"
import { MessagingWrapper, useMessagingContext } from "./components/MessagingContext"
import NotificationsSection from "./components/NotificationsSection"

const Messages = dynamic(() => import("./Messages"))

const MessagingSection = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isRegisteringWeb3Inbox,
    isSigningWeb3Inbox,
    isSubscribingWeb3Inbox,
    isWeb3InboxLoading,
    web3InboxError,
    subscribeWeb3Inbox,
    web3InboxSubscription,
    hasXmtpAccess,
    isCheckingXmtpAccess,
    subscribeXmtp,
    isLoadingDependencies,
    isSubscribingXmtp,
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
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader pb="4">Subscribe to messages</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb="8">
              Guild admins can send broadcast messages to your wallet through{" "}
              <Link href="https://web3inbox.com" colorScheme="blue" isExternal>
                Web3Inbox
                <Icon as={ArrowSquareOut} ml={1} />
              </Link>{" "}
              and{" "}
              <Link href="https://xmtp.com" colorScheme="blue" isExternal>
                XMTP
                <Icon as={ArrowSquareOut} ml={1} />
              </Link>
              . Sign a message to start receiving them!
            </Text>
            <HStack justifyContent={"space-between"} w={"full"} mb={"3"}>
              <Text as="span" fontWeight="semibold">
                Web3Inbox
              </Text>
              <Button
                isDisabled={Boolean(web3InboxSubscription)}
                variant="solid"
                colorScheme="blue"
                onClick={subscribeWeb3Inbox}
                isLoading={
                  isSigningWeb3Inbox ||
                  isRegisteringWeb3Inbox ||
                  isSubscribingWeb3Inbox
                }
                loadingText={
                  isSigningWeb3Inbox ? "Check your wallet" : "Subscribing"
                }
              >
                {Boolean(web3InboxSubscription) ? "Subscribed" : "Sign"}
              </Button>
            </HStack>
            <Divider mb={3} />
            <HStack justifyContent={"space-between"} w={"full"} mb={"3"}>
              <Text as="span" fontWeight="semibold">
                XMTP
              </Text>
              <Button
                isDisabled={Boolean(hasXmtpAccess)}
                variant="solid"
                colorScheme="blue"
                onClick={subscribeXmtp}
                isLoading={
                  isCheckingXmtpAccess || isLoadingDependencies || isSubscribingXmtp
                }
                loadingText={
                  isCheckingXmtpAccess || isLoadingDependencies || isSubscribingXmtp
                    ? "Check your wallet"
                    : "Subscribing"
                }
              >
                {Boolean(hasXmtpAccess) ? "Subscribed" : "Sign"}
              </Button>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
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
