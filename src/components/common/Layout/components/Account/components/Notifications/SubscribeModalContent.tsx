import {
  Divider,
  HStack,
  Icon,
  Link,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react"
import { useConversations } from "@xmtp/react-sdk"
import Button from "components/common/Button"
import { ArrowSquareOut } from "phosphor-react"
import { useMessagingContext } from "./components/MessagingContext"

export const SubscriptionModalContent = ({ onClose }) => {
  const {
    isRegisteringWeb3Inbox,
    isSigningWeb3Inbox,
    isSubscribingWeb3Inbox,
    subscribeWeb3Inbox,
    web3InboxSubscription,
    subscribeXmtp,
    isSubscribingXmtp,
    hasXmtpAccess,
  } = useMessagingContext()
  const conversations = useConversations()
  console.log("modal", hasXmtpAccess, conversations)

  return (
    <>
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
              loadingText={isSigningWeb3Inbox ? "Check your wallet" : "Subscribing"}
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
              isLoading={isSubscribingXmtp}
              loadingText={isSubscribingXmtp ? "Check your wallet" : "Subscribing"}
            >
              {Boolean(hasXmtpAccess) ? "Subscribed" : "Sign"}
            </Button>
          </HStack>
        </ModalBody>
      </ModalContent>
    </>
  )
}
