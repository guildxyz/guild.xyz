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
import Button from "components/common/Button"
import { ArrowSquareOut } from "phosphor-react"
import { useMessagingContext } from "./components/MessagingContext"

export const SubscriptionModalContent = ({ onClose }) => {
  const {
    isRegisteringWeb3Inbox,
    isSigningWeb3Inbox,
    isSubscribingWeb3Inbox,
    subscribeWeb3Inbox: performSubscribeWeb3Inbox,
    xmtpSubscription,
    web3InboxSubscription,
    subscribeXmtp,
    isSubscribingXmtp,
  } = useMessagingContext()

  console.log(xmtpSubscription, web3InboxSubscription)
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
            and/or{" "}
            <Link href="https://xmtp.com" colorScheme="blue" isExternal>
              XMTP
              <Icon as={ArrowSquareOut} ml={1} />
            </Link>
            . Sign a message to start receiving them!
          </Text>
          <HStack justifyContent={"space-between"} w={"full"} mb={"3"}>
            <Text as="span" fontWeight="semibold">
              {web3InboxSubscription
                ? "Already subscribed to Web3Inbox"
                : "Web3Inbox"}
            </Text>
            <Button
              isDisabled={Boolean(web3InboxSubscription)}
              variant="solid"
              colorScheme="blue"
              onClick={performSubscribeWeb3Inbox}
              isLoading={
                isSigningWeb3Inbox ||
                isRegisteringWeb3Inbox ||
                isSubscribingWeb3Inbox
              }
              loadingText={isSigningWeb3Inbox ? "Check your wallet" : "Subscribing"}
            >
              Sign
            </Button>
          </HStack>
          <Divider mb={3} />
          <HStack justifyContent={"space-between"} w={"full"} mb={"3"}>
            <Text as="span" fontWeight="semibold">
              {Boolean(xmtpSubscription?.keys.length)
                ? "Already subscribed to XMTP"
                : "XMTP"}
            </Text>
            <Button
              isDisabled={Boolean(xmtpSubscription?.keys.length)}
              variant="solid"
              colorScheme="blue"
              onClick={subscribeXmtp}
              isLoading={isSubscribingXmtp}
              loadingText={isSubscribingXmtp ? "Check your wallet" : "Subscribing"}
            >
              Sign
            </Button>
          </HStack>
        </ModalBody>
      </ModalContent>
    </>
  )
}
