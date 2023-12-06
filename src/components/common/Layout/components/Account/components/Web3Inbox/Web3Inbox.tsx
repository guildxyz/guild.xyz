import { Box, Collapse, HStack, Img, Stack, Text } from "@chakra-ui/react"
import {
  useInitWeb3InboxClient,
  useManageSubscription,
  useMessages,
  useW3iAccount,
} from "@web3inbox/widget-react"
import Button from "components/common/Button"
import useShowErrorToast from "hooks/useShowErrorToast"
import useToast from "hooks/useToast"
import dynamic from "next/dynamic"
import { useEffect } from "react"
import { useAccount, useSignMessage } from "wagmi"

const DynamicWeb3InboxMessage = dynamic(() => import("./Web3InboxMessage"))

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

  const { isSubscribed, subscribe, isSubscribing } = useManageSubscription()
  const { messages } = useMessages()

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
    } catch {
      showErrorToast("Couldn't subscribe to Guild messages")
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
                  <DynamicWeb3InboxMessage
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

export default Web3Inbox
