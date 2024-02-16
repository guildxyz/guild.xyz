import {
  Box,
  HStack,
  Icon,
  IconButton,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import dynamic from "next/dynamic"
import { Gear } from "phosphor-react"
import { useRef } from "react"
import SubscriptionPromptSkeleton from "../MessageSkeleton/SubscriptionPromptSkeleton"
import { MessagingSubscriptionModal } from "./MessageSubscriptionModal"
import { SubscriptionPrompt } from "./SubscriptionPrompt"
import { MessagingWrapper, useMessagingContext } from "./components/MessagingContext"
import NotificationsSection from "./components/NotificationsSection"
import { useGetWeb3InboxMessages } from "./components/web3Inbox"

const DynamicWeb3InboxMessage = dynamic(
  () => import("../Web3Inbox/Web3InboxMessage")
)

const Messages = () => {
  const { messages } = useGetWeb3InboxMessages()

  const inboxContainerRef = useRef(null)
  const isScrollable = !!inboxContainerRef.current
    ? inboxContainerRef.current.scrollHeight > inboxContainerRef.current.clientHeight
    : false

  return (
    <Box
      ref={inboxContainerRef}
      maxH="30vh"
      overflowY="auto"
      className="custom-scrollbar"
      pb="4"
      sx={{
        WebkitMaskImage:
          isScrollable &&
          "linear-gradient(to bottom, transparent 0%, black 5%, black 90%, transparent 100%), linear-gradient(to left, black 0%, black 8px, transparent 8px, transparent 100%)",
      }}
    >
      {messages?.length > 0 ? (
        <Stack pt={2} spacing={0}>
          {messages
            .sort((msgA, msgB) => msgB.sentAt - msgA.sentAt)
            .map(({ sentAt, id, title, body, url }) => (
              <DynamicWeb3InboxMessage
                key={id}
                sentAt={sentAt}
                title={title}
                body={body}
                url={url}
              />
            ))}
        </Stack>
      ) : (
        <HStack pt={3} px={4}>
          <Text colorScheme="gray">Your messages from guilds will appear here</Text>
        </HStack>
      )}
    </Box>
  )
}

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
      <MessagingSubscriptionModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}

export default () => (
  <MessagingWrapper>
    <MessagingSection />
  </MessagingWrapper>
)
