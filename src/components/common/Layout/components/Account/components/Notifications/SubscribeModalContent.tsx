import {
  Icon,
  Link,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast,
} from "@chakra-ui/react"
import {
  usePrepareRegistration,
  useRegister,
  useSubscribe,
  useWeb3InboxAccount,
} from "@web3inbox/react"
import { Client, useClient } from "@xmtp/react-sdk"
import useUser from "components/[guild]/hooks/useUser"
import Button from "components/common/Button"
import useShowErrorToast from "hooks/useShowErrorToast"
import { ArrowSquareOut } from "phosphor-react"
import { useCallback, useState } from "react"
import { useFetcherWithSign } from "utils/fetcher"
import { useAccount, useSignMessage, useWalletClient } from "wagmi"

export const WEB3_INBOX_INIT_PARAMS = {
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  domain: "guild.xyz",
  allApps: process.env.NODE_ENV !== "production",
}

export const useSubscribeWeb3Inbox = () => {
  const [isSigning, setIsSigning] = useState(false)

  const { address } = useAccount()
  const { data: account } = useWeb3InboxAccount(
    address ? `eip155:1:${address}` : undefined
  )
  const { register, isLoading: isRegistering } = useRegister()
  const { subscribe, isLoading: isSubscribing } = useSubscribe(
    account,
    WEB3_INBOX_INIT_PARAMS.domain
  )
  const { prepareRegistration } = usePrepareRegistration()
  const { signMessageAsync } = useSignMessage()
  const showErrorToast = useShowErrorToast()
  const toast = useToast()

  const performSubscribe = async () => {
    if (!address) return

    try {
      const { message, registerParams } = await prepareRegistration()
      setIsSigning(true)
      const signature = await signMessageAsync({ message: message }).finally(() =>
        setIsSigning(false)
      )
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
    } catch (web3InboxSubscribeError) {
      console.error("web3InboxSubscribeError", web3InboxSubscribeError)
      showErrorToast("Couldn't subscribe to Guild messages")
    }
  }
  return { performSubscribe, isRegistering, isSubscribing, isSigning }
}

export const useSubscribeXMTP = () => {
  const fetcherWithSign = useFetcherWithSign()
  const { error, isLoading, initialize } = useClient()
  const { id } = useUser()

  const { data: signer } = useWalletClient()

  const handleConnect = useCallback(async () => {
    console.log("%c handleConnect", "color: blue; font-size: 70px")
    await initialize({
      options: {
        persistConversations: false,
        env: "dev",
      },
      signer,
    }).then(() => {
      Client.getKeys(signer).then((key) => {
        fetcherWithSign([
          `/v2/users/${id}/keys`,
          {
            body: {
              key: Buffer.from(key).toString("binary"),
              service: "XMTP",
            },
          },
        ])
      })
    })
    return handleConnect
  }, [initialize, signer, id])
}

export const SubscribeModalContent = ({ onClose }) => {
  const subscribeWeb3Inbox = useSubscribeWeb3Inbox()
  const subscribeXMTP = useSubscribeXMTP()

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
            </Link>
            . Sign a message to start receiving them!
          </Text>
          <Button
            variant="solid"
            colorScheme="blue"
            onClick={subscribeWeb3Inbox.performSubscribe}
            isLoading={
              subscribeWeb3Inbox.isSigning ||
              subscribeWeb3Inbox.isRegistering ||
              subscribeWeb3Inbox.isSubscribing
            }
            loadingText={
              subscribeWeb3Inbox.isSigning ? "Check your wallet" : "Subscribing"
            }
            w="full"
          >
            Sign to subscribe
          </Button>
        </ModalBody>
      </ModalContent>
    </>
  )
}
