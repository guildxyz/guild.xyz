import { HStack, Img, Stack, Text } from "@chakra-ui/react"
import {
  useInitWeb3InboxClient,
  useManageSubscription,
  useW3iAccount,
} from "@web3inbox/widget-react"
import Button from "components/common/Button"
import useShowErrorToast from "hooks/useShowErrorToast"
import useToast from "hooks/useToast"
import { useEffect } from "react"
import { useAccount, useSignMessage } from "wagmi"

const Web3InboxSubscribe = () => {
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
    <Stack w="full">
      <Text
        fontSize="xs"
        fontWeight="bold"
        textTransform="uppercase"
        colorScheme="gray"
      >
        News
      </Text>

      <HStack justifyContent="space-between" w="full">
        <HStack>
          <Img src="/img/message.svg" boxSize={5} alt="Messages" />
          <Text as="span">Subscribe to messages</Text>
        </HStack>
        <Button
          variant="solid"
          size="sm"
          colorScheme="blue"
          onClick={performSubscribe}
          isDisabled={!isReady || isSubscribed}
          isLoading={!isReady || isRegistering || isSubscribing}
          minW="max-content"
        >
          {isSubscribed ? "Subscribed" : "Subscribe"}
        </Button>
      </HStack>
    </Stack>
  )
}
export default Web3InboxSubscribe
