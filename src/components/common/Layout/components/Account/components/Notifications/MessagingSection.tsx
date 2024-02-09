import { Icon, IconButton, useDisclosure } from "@chakra-ui/react"
import {
  initWeb3InboxClient,
  useSubscription,
  useWeb3InboxAccount,
} from "@web3inbox/react"
import useUser from "components/[guild]/hooks/useUser"
import { Modal } from "components/common/Modal"
import { Gear } from "phosphor-react"
import useSWRImmutable from "swr/immutable"
import { useFetcherWithSign } from "utils/fetcher"
import { useAccount } from "wagmi"
import {
  SubscribeModalContent,
  WEB3_INBOX_INIT_PARAMS,
} from "./SubscribeModalContent"
import { SubscriptionPrompt } from "./SubscriptionPrompt"
import NotificationsSection from "./components/NotificationsSection"

export const useCheckXmtpSubscription = () => {
  const { id, error } = useUser()
  const fetcherWithSign = useFetcherWithSign()

  const swrImmutable = useSWRImmutable(
    [
      id ? `/v2/users/${id}/keys` : null,
      {
        method: "GET",
        body: {
          Accept: "application/json",
          query: { service: "XMTP" },
        },
      },
    ],
    fetcherWithSign
  )
  console.log("xmtp data", swrImmutable)
  return {
    ...swrImmutable,
    isLoading: !swrImmutable.data,
    error: swrImmutable.error || error,
  }
}

export const useCheckWeb3InboxSubscription = () => {
  initWeb3InboxClient(WEB3_INBOX_INIT_PARAMS)
  const { address } = useAccount()

  const w3IAccount = useWeb3InboxAccount(address ? `eip155:1:${address}` : undefined)
  const subscr = useSubscription(w3IAccount.data, WEB3_INBOX_INIT_PARAMS.domain)
  console.log("%c w3is", "color: green", address, w3IAccount, subscr)

  return subscr.data
}

export const MessagingSection = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const hasWeb3InboxSubscription = useCheckWeb3InboxSubscription()
  const hasXmtpSubscription = useCheckXmtpSubscription()
  console.log(
    "%c messaging section",
    "color: pink",
    hasWeb3InboxSubscription,
    hasXmtpSubscription
  )

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
        {!hasWeb3InboxSubscription && !hasXmtpSubscription?.data && (
          <SubscriptionPrompt onClick={onOpen} />
        )}
      </NotificationsSection>
      <Modal {...{ isOpen, onClose }}>
        <SubscribeModalContent onClose={onclose} />
      </Modal>
    </>
  )
}

export default (
  <>
    <MessagingSection />
  </>
)
