import {
  Box,
  Icon,
  IconButton,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react"
import { useRumAction } from "@datadog/rum-react-integration"
import MetaMaskOnboarding from "@metamask/onboarding"
import { useWeb3React } from "@web3-react/core"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import { Error } from "components/common/Error"
import Link from "components/common/Link"
import { Modal } from "components/common/Modal"
import ModalButton from "components/common/ModalButton"
import { connectors } from "connectors"
import useKeyPair, {
  deleteKeyPairFromIdb,
  getKeyPairFromIdb,
} from "hooks/useKeyPair"
import { useRouter } from "next/router"
import { ArrowLeft, ArrowSquareOut } from "phosphor-react"
import { useEffect, useRef, useState } from "react"
import useSWR, { mutate, unstable_serialize } from "swr"
import useSWRImmutable from "swr/immutable"
import { User, WalletError } from "types"
import { useWeb3ConnectionManager } from "../../Web3ConnectionManager"
import ConnectorButton from "./components/ConnectorButton"
import DelegateCashButton from "./components/DelegateCashButton"
import processConnectionError from "./utils/processConnectionError"

type Props = {
  isOpen: boolean
  onClose: () => void
  onOpen: () => void
}

const fetchShouldLinkToUser = async (_: "shouldLinkToUser", userId: number) => {
  try {
    const { id: userIdToConnectTo } = JSON.parse(
      window.localStorage.getItem("userId")
    )

    if (
      typeof userId === "number" &&
      typeof userIdToConnectTo === "number" &&
      userIdToConnectTo !== userId
    ) {
      try {
        await deleteKeyPairFromIdb(userId).then(() =>
          mutate(unstable_serialize(["keyPair", userId]))
        )
      } catch {}
    }

    const keypair = await getKeyPairFromIdb(+userIdToConnectTo)

    return !!keypair
  } catch {
    // Remove in case it exists in an invalid form
    window.localStorage.removeItem("userId")
    return false
  }
}

// We don't open the modal on these routes
const ignoredRoutes = ["/_error", "/tgauth", "/oauth", "/googleauth"]

const WalletSelectorModal = ({ isOpen, onClose, onOpen }: Props): JSX.Element => {
  const addDatadogAction = useRumAction("trackingAppAction")

  const { isActive, account, connector } = useWeb3React()
  const { data: user } = useSWRImmutable<User>(account ? `/user/${account}` : null)
  const [error, setError] = useState<WalletError & Error>(null)

  // initialize metamask onboarding
  const onboarding = useRef<MetaMaskOnboarding>()
  if (typeof window !== "undefined") {
    onboarding.current = new MetaMaskOnboarding()
  }

  const closeModalAndSendAction = () => {
    onClose()
    addDatadogAction("Wallet selector modal closed")
    setTimeout(() => {
      connector.resetState()
      connector.deactivate?.()
    }, 200)
  }

  const { ready, set, keyPair } = useKeyPair()

  useEffect(() => {
    if (keyPair) onClose()
  }, [keyPair])

  const router = useRouter()

  useEffect(() => {
    if (
      ready &&
      !keyPair &&
      router.isReady &&
      !ignoredRoutes.includes(router.route)
    ) {
      const activate = connector.activate()
      if (typeof activate !== "undefined") {
        activate.finally(() => onOpen())
      }
    }
  }, [keyPair, ready, router])

  const { data: shouldLinkToUser } = useSWR(
    ["shouldLinkToUser", user?.id],
    fetchShouldLinkToUser
  )

  const { isDelegateConnection, setIsDelegateConnection } =
    useWeb3ConnectionManager()

  const isConnected = account && isActive && ready

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={closeModalAndSendAction}
        closeOnOverlayClick={!isActive || !!keyPair}
        closeOnEsc={!isActive || !!keyPair}
      >
        <ModalOverlay />
        <ModalContent data-test="wallet-selector-modal">
          <ModalHeader display={"flex"}>
            <Box
              {...((isConnected && !keyPair) || isDelegateConnection
                ? {
                    w: "10",
                    opacity: 1,
                  }
                : {
                    w: "0",
                    opacity: 0,
                  })}
              transition="width .2s, opacity .2s"
              mt="-1px"
            >
              <IconButton
                rounded={"full"}
                aria-label="Back"
                size="sm"
                icon={<ArrowLeft size={20} />}
                variant="ghost"
                onClick={() => {
                  if (isDelegateConnection && !(isConnected && !keyPair)) {
                    setIsDelegateConnection(false)
                    return
                  }
                  set.reset()
                  connector.resetState()
                  connector.deactivate?.()
                }}
              />
            </Box>
            <Text>
              {shouldLinkToUser
                ? "Link address"
                : isDelegateConnection
                ? "Connect hot wallet"
                : "Connect wallet"}
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Error error={error} processError={processConnectionError} />
            {isConnected && !keyPair && (
              <Text mb="6" animation={"fadeIn .3s .1s both"}>
                Sign message to verify that you're the owner of this account.
              </Text>
            )}
            <Stack spacing="0">
              {connectors.map(([conn, connectorHooks]) => {
                if (!conn || !connectorHooks) return null

                return (
                  <CardMotionWrapper key={conn.constructor.name}>
                    <ConnectorButton
                      connector={conn}
                      connectorHooks={connectorHooks}
                      error={error}
                      setError={setError}
                    />
                  </CardMotionWrapper>
                )
              })}
              {!isDelegateConnection && (
                <CardMotionWrapper>
                  <DelegateCashButton />
                </CardMotionWrapper>
              )}
            </Stack>
            {isConnected && !keyPair && (
              <Box animation={"fadeIn .3s .1s both"}>
                <ModalButton
                  size="xl"
                  mb="4"
                  colorScheme={"green"}
                  onClick={() => {
                    set.onSubmit(shouldLinkToUser)
                    addDatadogAction("click on Verify account")
                  }}
                  isLoading={set.isLoading || !ready}
                  isDisabled={!ready || shouldLinkToUser === undefined}
                  loadingText={
                    !ready
                      ? "Looking for keypairs"
                      : set.signLoadingText || "Check your wallet"
                  }
                >
                  {shouldLinkToUser ? "Link address" : "Verify account"}
                </ModalButton>
              </Box>
            )}
          </ModalBody>
          <ModalFooter mt="-4">
            {!isConnected && (
              <Text textAlign="center" w="full" colorScheme={"gray"}>
                New to Ethereum wallets?{" "}
                <Link
                  colorScheme="blue"
                  href="https://ethereum.org/en/wallets/"
                  isExternal
                >
                  Learn more
                  <Icon as={ArrowSquareOut} mx="1" />
                </Link>
              </Text>
            )}
            {isConnected && (
              <Text textAlign="center" w="full" colorScheme={"gray"}>
                Signing the message doesn't cost any gas
              </Text>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default WalletSelectorModal
