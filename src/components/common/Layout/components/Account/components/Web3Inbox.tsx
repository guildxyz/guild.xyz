import {
  Box,
  Collapse,
  HStack,
  Icon,
  Img,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import {
  useInitWeb3InboxClient,
  useManageSubscription,
  useMessages,
  useW3iAccount,
} from "@web3inbox/widget-react"
import Button from "components/common/Button"
import Link from "components/common/Link"
import { Modal } from "components/common/Modal"
import useShowErrorToast from "hooks/useShowErrorToast"
import useToast from "hooks/useToast"
import { ArrowRight } from "phosphor-react"
import { useEffect } from "react"
import { useAccount, useSignMessage } from "wagmi"

const Web3Inbox = () => {
  const { address } = useAccount()
  const { signMessageAsync } = useSignMessage()

  const showErrorToast = useShowErrorToast()
  const toast = useToast()

  const isReady = useInitWeb3InboxClient({
    projectId: "d851f25304d67fc8e2dd3b354223e4fa",
    domain: "guild-xyz.vercel.app",
    isLimited: process.env.NODE_ENV === "production",
  })

  const { setAccount, register, isRegistering } = useW3iAccount()

  useEffect(() => {
    if (!address) return
    setAccount(`eip155:1:${address}`)
  }, [address, setAccount])

  const performRegistration = async () => {
    if (!address) return

    try {
      await register(async (message) => signMessageAsync({ message }))
    } catch (registerIdentityError) {
      showErrorToast("Web3Inbox registration error")
    }
  }

  const { isSubscribed, subscribe, isSubscribing } = useManageSubscription()
  const { messages } = useMessages()

  const performSubscribe = async () => {
    try {
      await performRegistration()
      await subscribe()
      toast({
        status: "success",
        title: "Success",
        description: "Successfully subscribed to Guild notifications via Web3Inbox",
      })
    } catch {
      showErrorToast("Couldn't subscribe to Guild notifications")
    }
  }

  return (
    <Stack spacing={0}>
      <Collapse in={!isSubscribed}>
        <HStack alignItems="start" pt={4}>
          <Img src="/img/message.svg" boxSize={6} alt="Messages" mt={0.5} mr={2} />
          <Stack spacing={2.5}>
            <Stack spacing={0.5}>
              <Text as="span" fontWeight="bold">
                Subscribe to messages
              </Text>
              <Text as="span" fontSize="sm" colorScheme="gray" lineHeight={1.25}>
                Receive messages from guild admins
              </Text>
            </Stack>

            <Button
              variant="solid"
              size="sm"
              colorScheme="blue"
              onClick={performSubscribe}
              isDisabled={!isReady || isSubscribed}
              isLoading={!isReady || isRegistering || isSubscribing}
              minW="max-content"
              maxW="max-content"
            >
              {isSubscribed ? "Subscribed" : "Subscribe"}
            </Button>
          </Stack>
        </HStack>
      </Collapse>

      <Collapse
        in={isSubscribed}
        style={{ marginInline: "calc(-1 * var(--chakra-space-4))" }}
      >
        <Box
          maxH="30vh"
          overflowY="auto"
          className="custom-scrollbar"
          sx={{
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, black 5%, black 90%, transparent 100%), linear-gradient(to left, black 0%, black 8px, transparent 8px, transparent 100%)",
          }}
        >
          {messages?.length > 0 ? (
            <Stack pt={2} spacing={0}>
              {messages.map(
                ({ publishedAt, message: { id, icon, title, body, url } }) => (
                  <Web3InboxMessage
                    key={id}
                    publishedAt={publishedAt}
                    icon={icon}
                    title={title}
                    body={body}
                    url={url}
                  />
                )
              )}
            </Stack>
          ) : (
            <HStack pt={4} pb={2} px={4}>
              <Img
                src="/img/message.svg"
                boxSize={6}
                alt="Messages"
                mt={0.5}
                mr={2}
              />

              <Text colorScheme="gray">Your messages will appear here</Text>
            </HStack>
          )}
        </Box>
      </Collapse>
    </Stack>
  )
}

const Web3InboxMessage = ({
  publishedAt,
  title,
  icon,
  body,
  url,
}: {
  publishedAt: number
  title: string
  icon: string
  body: string
  url: string
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const hoverBgColor = useColorModeValue("blackAlpha.300", "whiteAlpha.200")
  const lightModalBgColor = useColorModeValue("white", "gray.700")
  const isMobile = useBreakpointValue({ base: true, sm: false })

  const prettyDate = new Date(publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: isMobile ? undefined : "2-digit",
    minute: isMobile ? undefined : "2-digit",
  })

  return (
    <>
      <HStack
        as="button"
        spacing={4}
        textAlign="left"
        px={4}
        py={2}
        _focusVisible={{
          outline: "none",
          bgColor: hoverBgColor,
        }}
        _hover={{
          bgColor: hoverBgColor,
        }}
        transition="background 0.2s ease"
        onClick={onOpen}
      >
        <Img src={icon} alt={title} boxSize={6} borderRadius="full" />

        <Stack spacing={0} w="full">
          <HStack justifyContent="space-between">
            <Text as="span" fontWeight="bold" noOfLines={1}>
              {title}
            </Text>
            <Text as="span" colorScheme="gray" fontSize="sm">
              {prettyDate}
            </Text>
          </HStack>
          <Text noOfLines={1} colorScheme="gray">
            {body}
          </Text>
        </Stack>
      </HStack>

      <Modal isOpen={isOpen} onClose={onClose} colorScheme="dark">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bgColor={lightModalBgColor}>
            <HStack spacing={4}>
              <Img src={icon} alt={title} boxSize={12} borderRadius="full" />
              <Stack spacing={0.5}>
                <Text as="span">{title}</Text>
                <Text fontFamily="body" colorScheme="gray" fontSize="sm">
                  {prettyDate}
                </Text>
              </Stack>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody pt={8}>
            <Stack spacing={4}>
              <Text>{body}</Text>
              <Link href={url} colorScheme="blue" ml="auto">
                Visit guild
                <Icon as={ArrowRight} ml={1} />
              </Link>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default Web3Inbox
