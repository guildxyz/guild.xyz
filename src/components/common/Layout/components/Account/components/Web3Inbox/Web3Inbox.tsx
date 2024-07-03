import {
  Box,
  Center,
  Collapse,
  HStack,
  Icon,
  IconButton,
  Img,
  Link,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import { ArrowRight, ArrowSquareOut } from "@phosphor-icons/react"
import {
  initWeb3InboxClient,
  useNotifications,
  usePrepareRegistration,
  useRegister,
  useSubscribe,
  useSubscription,
  useWeb3InboxAccount,
  useWeb3InboxClient,
} from "@web3inbox/react"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import { env } from "env"
import useShowErrorToast from "hooks/useShowErrorToast"
import useToast from "hooks/useToast"
import dynamic from "next/dynamic"
import { useRef, useState } from "react"
import { useAccount, useSignMessage } from "wagmi"
import WebInboxSkeleton from "./WebInboxSkeleton"

const DynamicWeb3InboxMessage = dynamic(() => import("./Web3InboxMessage"))

const WEB3_INBOX_INIT_PARAMS = {
  projectId: env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  domain: "guild.xyz",
  allApps: process.env.NODE_ENV !== "production",
}

const Web3Inbox = () => {
  initWeb3InboxClient(WEB3_INBOX_INIT_PARAMS)
  const { data } = useWeb3InboxClient()
  const isReady = !!data

  const { address } = useAccount()
  const { data: account } = useWeb3InboxAccount(
    address ? `eip155:1:${address}` : undefined
  )

  const { data: subscription } = useSubscription(
    account,
    WEB3_INBOX_INIT_PARAMS.domain
  )

  const { data: messages } = useNotifications(
    5,
    false,
    account,
    WEB3_INBOX_INIT_PARAMS.domain
  )

  const inboxContainerRef = useRef(null)
  const isScrollable = !!inboxContainerRef.current
    ? inboxContainerRef.current.scrollHeight > inboxContainerRef.current.clientHeight
    : false

  if (!isReady) return <WebInboxSkeleton />

  return (
    <Stack spacing={0}>
      <Collapse in={!subscription}>
        <HStack pt={4} pb={5} pl={1} spacing={4}>
          <Center boxSize="6" flexShrink={0}>
            <Img src="/img/message.svg" boxSize={5} alt="Messages" mt={0.5} />
          </Center>
          <Stack spacing={0.5} w="full">
            <Text as="span" fontWeight="semibold">
              Subscribe to messages
            </Text>
            <Text as="span" fontSize="sm" colorScheme="gray" lineHeight={1.25}>
              Receive messages from guild admins
            </Text>
          </Stack>

          <SubscribeToMessages />
        </HStack>
      </Collapse>

      <Collapse
        in={!!subscription}
        style={{ marginInline: "calc(-1 * var(--chakra-space-4))" }}
      >
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
              <Text colorScheme="gray">
                Your messages from guilds will appear here
              </Text>
            </HStack>
          )}
        </Box>
      </Collapse>
    </Stack>
  )
}

const SubscribeToMessages = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { address } = useAccount()

  const { data: account } = useWeb3InboxAccount(
    address ? `eip155:1:${address}` : undefined
  )

  const [isSigning, setIsSigning] = useState(false)

  const { prepareRegistration } = usePrepareRegistration()
  const { register, isLoading: isRegistering } = useRegister()
  const { subscribe, isLoading: isSubscribing } = useSubscribe(
    account,
    WEB3_INBOX_INIT_PARAMS.domain
  )

  const { signMessageAsync } = useSignMessage()

  const showErrorToast = useShowErrorToast()
  const toast = useToast()

  const performSubscribe = async () => {
    if (!address) return

    try {
      const { message, registerParams } = await prepareRegistration()
      setIsSigning(true)
      const signature = await signMessageAsync({
        account: address,
        message: message,
      }).finally(() => setIsSigning(false))
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
      onClose()
    } catch (web3InboxSubscribeError) {
      console.error("web3InboxSubscribeError", web3InboxSubscribeError)
      showErrorToast("Couldn't subscribe to Guild messages")
    }
  }

  return (
    <>
      <IconButton
        variant="solid"
        colorScheme="blue"
        size="sm"
        onClick={onOpen}
        isLoading={isSubscribing}
        icon={<ArrowRight />}
        aria-label="Open subscribe modal"
      />
      <Modal {...{ isOpen, onClose }}>
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
              </Link>
              . Sign a message to start receiving them!
            </Text>
            <Button
              variant="solid"
              colorScheme="blue"
              onClick={performSubscribe}
              isLoading={isSigning || isRegistering || isSubscribing}
              loadingText={isSigning ? "Check your wallet" : "Subscribing"}
              w="full"
            >
              Sign to subscribe
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default Web3Inbox
