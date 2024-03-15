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

import { Link } from "@chakra-ui/next-js"
import { useUserPublic } from "components/[guild]/hooks/useUser"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import { Error as ErrorComponent } from "components/common/Error"
import { addressLinkParamsAtom } from "components/common/Layout/components/Account/components/AccountModal/components/LinkAddressButton"
import useLinkVaults from "components/common/Layout/components/Account/components/AccountModal/hooks/useLinkVaults"
import { Modal } from "components/common/Modal"
import ModalButton from "components/common/ModalButton"
import useSetKeyPair from "hooks/useSetKeyPair"
import { useAtom } from "jotai"
import { useRouter } from "next/router"
import { ArrowLeft, ArrowSquareOut } from "phosphor-react"
import { useEffect } from "react"
import { WAAS_CONNECTOR_ID } from "waasConnector"
import { Connector, useAccount, useConnect } from "wagmi"
import useWeb3ConnectionManager from "../../hooks/useWeb3ConnectionManager"
import AccountButton from "./components/AccountButton"
import ConnectorButton from "./components/ConnectorButton"
import DelegateCashButton, {
  delegateConnectionAtom,
} from "./components/DelegateCashButton"
import FuelConnectorButtons from "./components/FuelConnectorButtons"
import GoogleLoginButton from "./components/GoogleLoginButton"
import useIsWalletConnectModalActive from "./hooks/useIsWalletConnectModalActive"
import useLinkAddress from "./hooks/useLinkAddress"
import processConnectionError from "./utils/processConnectionError"

type Props = {
  isOpen: boolean
  onClose: () => void
  onOpen: () => void
}

// We don't open the modal on these routes
const ignoredRoutes = [
  "/_error",
  "/tgauth",
  "/oauth",
  "/googleauth",
  "/oauth-result",
]

const WalletSelectorModal = ({ isOpen, onClose, onOpen }: Props): JSX.Element => {
  const { isWeb3Connected, isInSafeContext, disconnect } = useWeb3ConnectionManager()
  const [isDelegateConnection, setIsDelegateConnection] = useAtom(
    delegateConnectionAtom
  )

  const { connectors, error, connect, isPending } = useConnect()
  const { connector } = useAccount()

  const [addressLinkParams] = useAtom(addressLinkParamsAtom)
  const isAddressLink = !!addressLinkParams?.userId

  const closeModalAndSendAction = () => {
    onClose()
    setTimeout(() => {
      disconnect()
    }, 200)
  }

  const { keyPair, id, error: publicUserError } = useUserPublic()
  const set = useSetKeyPair()
  const linkVaults = useLinkVaults()

  useEffect(() => {
    if (!!keyPair && isDelegateConnection) {
      linkVaults.onSubmit()
      setIsDelegateConnection(false)
    }
  }, [keyPair, isDelegateConnection])

  useEffect(() => {
    if (keyPair) onClose()
  }, [keyPair])

  const router = useRouter()

  useEffect(() => {
    if (
      ((!!id && !keyPair) || !!publicUserError) &&
      router.isReady &&
      !ignoredRoutes.includes(router.route) &&
      !!connector?.connect
    ) {
      const activate = connector.connect()
      if (typeof activate !== "undefined") {
        activate.finally(() => onOpen())
      }
    }
  }, [keyPair, router, id, publicUserError, connector])

  const isConnectedAndKeyPairReady = isWeb3Connected && !!id

  const isWalletConnectModalActive = useIsWalletConnectModalActive()

  const linkAddress = useLinkAddress()

  const shouldShowVerify =
    isWeb3Connected && (!!publicUserError || (!!id && !keyPair))

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModalAndSendAction}
      closeOnOverlayClick={!isWeb3Connected || !!keyPair}
      closeOnEsc={!isWeb3Connected || !!keyPair}
      trapFocus={!isWalletConnectModalActive}
    >
      <ModalOverlay />
      <ModalContent data-test="wallet-selector-modal">
        <ModalHeader display={"flex"}>
          {((isConnectedAndKeyPairReady && !keyPair) || isDelegateConnection) && (
            <IconButton
              rounded={"full"}
              aria-label="Back"
              size="sm"
              icon={<ArrowLeft size={20} />}
              variant="ghost"
              onClick={() => {
                if (
                  isDelegateConnection &&
                  !(isConnectedAndKeyPairReady && !keyPair)
                ) {
                  setIsDelegateConnection(false)
                  return
                }
                set.reset()
                disconnect()
              }}
            />
          )}
          <Text ml="1.5" mt="-1px">
            {isAddressLink
              ? "Link address"
              : isDelegateConnection
              ? "Connect hot wallet"
              : "Connect to Guild"}
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <ErrorComponent
            {...(set.error || linkAddress.error
              ? {
                  error: set.error ?? linkAddress.error,
                  processError: (err: any) => {
                    if (err?.code === "ACTION_REJECTED") {
                      return {
                        title: "Rejected",
                        description: "Signature request has been rejected",
                      }
                    }

                    return {
                      title: "Error",
                      description:
                        err?.message ?? typeof err?.error === "string"
                          ? err?.error
                          : typeof err === "string"
                          ? err
                          : err?.errors?.[0]?.msg,
                    }
                  },
                }
              : { error, processError: processConnectionError })}
          />
          {shouldShowVerify && (
            <Text mb="6" animation={"fadeIn .3s .1s both"}>
              Sign message to verify that you're the owner of this address.
            </Text>
          )}

          {isWeb3Connected ? (
            <AccountButton />
          ) : (
            <Stack spacing="0">
              {!connector && (
                <>
                  <GoogleLoginButton />
                  <Text
                    mt={6}
                    mb={2}
                    textTransform={"uppercase"}
                    fontSize={"xs"}
                    fontWeight={700}
                    color={"gray"}
                  >
                    Or connect with wallet
                  </Text>
                </>
              )}

              {connectors
                .filter(
                  (conn) =>
                    (isInSafeContext || conn.id !== "safe") &&
                    (!!connector || conn.id !== WAAS_CONNECTOR_ID)
                )
                .map((conn) => (
                  <CardMotionWrapper key={conn.id}>
                    <ConnectorButton
                      connector={conn}
                      connect={connect}
                      isLoading={isPending}
                      pendingConnector={null as Connector}
                      error={error}
                    />
                  </CardMotionWrapper>
                ))}
              {!isDelegateConnection && <DelegateCashButton />}
              <FuelConnectorButtons key="fuel" />
            </Stack>
          )}

          {shouldShowVerify && (
            <Box animation={"fadeIn .3s .1s both"}>
              <ModalButton
                data-test="verify-address-button"
                size="xl"
                mb="4"
                colorScheme={"green"}
                onClick={() => {
                  if (isAddressLink) {
                    return linkAddress.onSubmit(addressLinkParams)
                  }
                  return set.onSubmit()
                }}
                isLoading={
                  linkAddress.isLoading || set.isLoading || (!id && !publicUserError)
                }
                isDisabled={!id && !publicUserError}
                loadingText={!id ? "Looking for keypairs" : "Check your wallet"}
              >
                {isAddressLink ? "Link address" : "Verify address"}
              </ModalButton>
            </Box>
          )}
        </ModalBody>
        <ModalFooter mt="-4">
          {!isConnectedAndKeyPairReady ? (
            <Stack textAlign="center" fontSize="sm" w="full">
              <Text colorScheme="gray">
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

              <Text colorScheme="gray">
                By continuing, you agree to our{" "}
                <Link
                  href="/privacy-policy"
                  fontWeight={"semibold"}
                  onClick={onClose}
                >
                  Privacy Policy
                </Link>
                {` and `}
                <Link href="/terms-of-use" fontWeight={"semibold"} onClick={onClose}>
                  Terms & conditions
                </Link>
              </Text>
            </Stack>
          ) : (
            <Stack textAlign="center" fontSize="sm" w="full">
              <Text colorScheme={"gray"}>
                Signing the message doesn't cost any gas
              </Text>
              <Text colorScheme="gray">
                This site is protected by reCAPTCHA, so the Google{" "}
                <Link
                  href="https://policies.google.com/privacy"
                  isExternal
                  fontWeight={"semibold"}
                >
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link
                  href="https://policies.google.com/terms"
                  isExternal
                  fontWeight={"semibold"}
                >
                  Terms of Service
                </Link>{" "}
                apply
              </Text>
            </Stack>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default WalletSelectorModal
