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
import {
  useInitWeb3InboxClient,
  useManageSubscription,
  useMessages,
  useW3iAccount,
} from "@web3inbox/widget-react"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import useShowErrorToast from "hooks/useShowErrorToast"
import useToast from "hooks/useToast"
import dynamic from "next/dynamic"
import { ArrowRight, ArrowSquareOut } from "phosphor-react"
import { useEffect, useRef } from "react"
import { useAccount, useSignMessage } from "wagmi"

const DynamicWeb3InboxMessage = dynamic(() => import("./Web3InboxMessage"))

const Web3Inbox = () => {
  const { address } = useAccount()
  const { isSubscribed } = useManageSubscription()
  const { setAccount } = useW3iAccount()

  useEffect(() => {
    if (!address) return
    setAccount(`eip155:1:${address}`)
  }, [address, setAccount])

  const { messages } = useMessages()

  const inboxContainerRef = useRef(null)
  const isScrollable = !!inboxContainerRef.current
    ? inboxContainerRef.current.scrollHeight > inboxContainerRef.current.clientHeight
    : false

  return (
    <Stack spacing={0}>
      <Collapse in={!isSubscribed}>
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
        in={isSubscribed}
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
                .sort((msgA, msgB) => msgB.publishedAt - msgA.publishedAt)
                .map(({ publishedAt, message: { id, icon, title, body, url } }) => (
                  <DynamicWeb3InboxMessage
                    key={id}
                    publishedAt={publishedAt}
                    icon={icon}
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
  const { subscribe, isSubscribing } = useManageSubscription()
  const { signMessageAsync } = useSignMessage()
  const { register, isRegistering } = useW3iAccount()

  const showErrorToast = useShowErrorToast()
  const toast = useToast()

  const isReady = useInitWeb3InboxClient({
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    domain: "guild.xyz",
    isLimited: process.env.NODE_ENV === "production",
  })

  const performSubscribe = async () => {
    if (!address) return

    try {
      await register(async (message) => signMessageAsync({ message }))
    } catch (registerIdentityError) {
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
    } catch {
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
              . Sign a message to start recieving them!
            </Text>
            <Button
              variant="solid"
              colorScheme="blue"
              onClick={performSubscribe}
              isDisabled={!isReady}
              isLoading={!isReady || isRegistering || isSubscribing}
              loadingText={isReady && "Check your wallet"}
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
