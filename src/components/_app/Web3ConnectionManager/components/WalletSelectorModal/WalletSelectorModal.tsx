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
import { usePostHogContext } from "components/_app/PostHogProvider"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import { Error as ErrorComponent } from "components/common/Error"
import { addressLinkParamsAtom } from "components/common/Layout/components/Account/components/AccountModal/components/LinkAddressButton"
import { Modal } from "components/common/Modal"
import ModalButton from "components/common/ModalButton"
import useSetKeyPair from "hooks/useSetKeyPair"
import { useAtom, useSetAtom } from "jotai"
import { useRouter } from "next/router"
import { ArrowLeft, ArrowSquareOut } from "phosphor-react"
import { useEffect } from "react"
import { useAccount, useConnect, type Connector } from "wagmi"
import { WAAS_CONNECTOR_ID } from "wagmiConfig/waasConnector"
import useWeb3ConnectionManager from "../../hooks/useWeb3ConnectionManager"
import { walletLinkHelperModalAtom } from "../WalletLinkHelperModal"
import AccountButton from "./components/AccountButton"
import ConnectorButton from "./components/ConnectorButton"
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

const COINBASE_INJECTED_WALLET_ID = "com.coinbase.wallet"

const WalletSelectorModal = ({ isOpen, onClose, onOpen }: Props): JSX.Element => {
  const { isWeb3Connected, isInSafeContext, disconnect } = useWeb3ConnectionManager()

  const { connectors, error, connect, variables, isPending } = useConnect()

  /**
   * If we can't detect an EIP-6963 compatible wallet, we fallback to a general
   * injected wallet option
   */
  const shouldShowInjected =
    !!window.ethereum &&
    connectors
      .filter((c) => c.id !== COINBASE_INJECTED_WALLET_ID)
      .filter((c) => c.type === "injected").length === 1

  const { connector, status } = useAccount()

  const [addressLinkParams] = useAtom(addressLinkParamsAtom)
  const isAddressLink = !!addressLinkParams?.userId

  const closeModalAndSendAction = () => {
    onClose()
    setTimeout(() => {
      disconnect()
    }, 200)
  }

  const { captureEvent } = usePostHogContext()

  const { keyPair, id, error: publicUserError } = useUserPublic()
  const set = useSetKeyPair({
    onError: (err) => {
      /**
       * Needed temporarily for debugging WalletConnect issues (GUILD-2423) Checking
       * for Error instance to filter out fetcher-thrown errors, which are irrelevant
       * here
       */
      if (err instanceof Error) {
        captureEvent("[verify] - failed", {
          errorMessage: err.message,
          errorStack: err.stack,
          errorCause: err.cause,
          wagmiAccountStatus: status,
        })
      }
    },
  })

  useEffect(() => {
    if (keyPair && !isAddressLink) onClose()
  }, [keyPair, isAddressLink, onClose])

  const router = useRouter()

  useEffect(() => {
    if (
      ((!!id && !keyPair) || !!publicUserError) &&
      router.isReady &&
      !ignoredRoutes.includes(router.route) &&
      !!connector?.connect
    ) {
      onOpen()
    }
  }, [keyPair, router, id, publicUserError, connector, onOpen])

  const isConnectedAndKeyPairReady = isWeb3Connected && !!id

  const isWalletConnectModalActive = useIsWalletConnectModalActive()

  const linkAddress = useLinkAddress()

  const shouldShowVerify =
    isWeb3Connected && (!!publicUserError || (!!id && !keyPair))

  const setIsWalletLinkHelperModalOpen = useSetAtom(walletLinkHelperModalAtom)
  useEffect(() => {
    if (!isWeb3Connected) return
    setIsWalletLinkHelperModalOpen(false)
  }, [isWeb3Connected, setIsWalletLinkHelperModalOpen])

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
          {isConnectedAndKeyPairReady && !keyPair && (
            <IconButton
              rounded="full"
              aria-label="Back"
              size="sm"
              icon={<ArrowLeft size={20} />}
              variant="ghost"
              onClick={() => {
                set.reset()
                disconnect()
              }}
            />
          )}
          <Text ml="1.5" mt="-1px">
            {isAddressLink ? "Link address" : "Connect to Guild"}
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
              {!connector && !addressLinkParams?.userId && (
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
                    (!!connector || conn.id !== WAAS_CONNECTOR_ID) &&
                    (shouldShowInjected || conn.id !== "injected") &&
                    // Filtering Coinbase Wallet, since we use the `coinbaseWallet` connector for it
                    conn.id !== COINBASE_INJECTED_WALLET_ID
                )
                .sort((conn, _) => (conn.type === "injected" ? -1 : 0))
                .map((conn) => (
                  <CardMotionWrapper key={conn.id}>
                    <ConnectorButton
                      connector={conn}
                      connect={connect}
                      pendingConnector={
                        isPending && (variables?.connector as Connector)
                      }
                      error={error}
                    />
                  </CardMotionWrapper>
                ))}
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
                <span>{"New to Ethereum wallets? "}</span>
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
                <span>{"By continuing, you agree to our "}</span>
                <Link
                  href="/privacy-policy"
                  fontWeight={"semibold"}
                  onClick={onClose}
                >
                  Privacy Policy
                </Link>
                <span>{" and "}</span>
                <Link href="/terms-of-use" fontWeight={"semibold"} onClick={onClose}>
                  Terms & conditions
                </Link>
              </Text>
            </Stack>
          ) : (
            <Stack textAlign="center" fontSize="sm" w="full">
              <Text colorScheme="gray">
                Signing the message doesn't cost any gas
              </Text>
              <Text colorScheme="gray">
                <span>{"This site is protected by reCAPTCHA, so the Google "}</span>
                <Link
                  href="https://policies.google.com/privacy"
                  isExternal
                  fontWeight={"semibold"}
                >
                  Privacy Policy
                </Link>{" "}
                <span>{"and "}</span>
                <Link
                  href="https://policies.google.com/terms"
                  isExternal
                  fontWeight={"semibold"}
                >
                  Terms of Service
                </Link>
                <span>{" apply"}</span>
              </Text>
            </Stack>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default WalletSelectorModal
