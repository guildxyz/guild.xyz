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
import MetaMaskOnboarding from "@metamask/onboarding"

import { useUserPublic } from "components/[guild]/hooks/useUser"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import { Error } from "components/common/Error"
import { addressLinkParamsAtom } from "components/common/Layout/components/Account/components/AccountModal/components/LinkAddressButton"
import Link from "components/common/Link"
import { Modal } from "components/common/Modal"
import ModalButton from "components/common/ModalButton"
import useFuel from "hooks/useFuel"
import useKeyPair from "hooks/useKeyPair"
import useSetKeyPair from "hooks/useSetKeyPair"
import { useAtom } from "jotai"
import { useRouter } from "next/router"
import { ArrowLeft, ArrowSquareOut } from "phosphor-react"
import { useEffect, useRef } from "react"
import ReCAPTCHA from "react-google-recaptcha"
import { useAccount, useConnect } from "wagmi"
import useWeb3ConnectionManager from "../../hooks/useWeb3ConnectionManager"
import AccountButton from "./components/AccountButton"
import ConnectorButton from "./components/ConnectorButton"
import DelegateCashButton from "./components/DelegateCashButton"
import FuelConnectorButtons from "./components/FuelConnectorButtons"
import useIsWalletConnectModalActive from "./hooks/useIsWalletConnectModalActive"
import useLinkAddress from "./hooks/useLinkAddress"
import processConnectionError from "./utils/processConnectionError"

type Props = {
  isOpen: boolean
  onClose: () => void
  onOpen: () => void
}

// We don't open the modal on these routes
const ignoredRoutes = ["/_error", "/tgauth", "/oauth", "/googleauth"]

const WalletSelectorModal = ({ isOpen, onClose, onOpen }: Props): JSX.Element => {
  const {
    isWeb3Connected,
    isDelegateConnection,
    setIsDelegateConnection,
    isInSafeContext,
    disconnect,
  } = useWeb3ConnectionManager()

  const { connectors, error, connect, pendingConnector, isLoading } = useConnect()
  const { connector } = useAccount()

  const [addressLinkParams] = useAtom(addressLinkParamsAtom)
  const isAddressLink = !!addressLinkParams?.userId

  const { captchaVerifiedSince } = useUserPublic()

  // initialize metamask onboarding
  const onboarding = useRef<MetaMaskOnboarding>()
  if (typeof window !== "undefined") {
    onboarding.current = new MetaMaskOnboarding()
  }

  const closeModalAndSendAction = () => {
    onClose()
    setTimeout(() => {
      disconnect()
    }, 200)
  }

  const { keyPair } = useKeyPair()
  const set = useSetKeyPair()

  useEffect(() => {
    if (keyPair) onClose()
  }, [keyPair])

  const router = useRouter()

  useEffect(() => {
    if (
      keyPair === null &&
      router.isReady &&
      !ignoredRoutes.includes(router.route) &&
      !!connector?.connect
    ) {
      const activate = connector.connect()
      if (typeof activate !== "undefined") {
        activate.finally(() => onOpen())
      }
    }
  }, [keyPair, router])

  const isConnectedAndKeyPairReady =
    isWeb3Connected && (!!keyPair || keyPair === null)

  const isWalletConnectModalActive = useIsWalletConnectModalActive()

  const { windowFuel } = useFuel()

  const recaptchaRef = useRef<ReCAPTCHA>()

  const linkAddress = useLinkAddress()

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
          <Box
            {...((isConnectedAndKeyPairReady && !keyPair) || isDelegateConnection
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
          </Box>
          <Text>
            {isAddressLink
              ? "Link address"
              : isDelegateConnection
              ? "Connect hot wallet"
              : "Connect wallet"}
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Error
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
          {isConnectedAndKeyPairReady && !keyPair && (
            <Text mb="6" animation={"fadeIn .3s .1s both"}>
              Sign message to verify that you're the owner of this address.
            </Text>
          )}

          {isWeb3Connected ? (
            <CardMotionWrapper>
              <AccountButton />
            </CardMotionWrapper>
          ) : (
            <Stack spacing="0">
              {connectors
                .filter((conn) => isInSafeContext || conn.id !== "safe")
                .map((conn) => (
                  <CardMotionWrapper key={conn.id}>
                    <ConnectorButton
                      connector={conn}
                      connect={connect}
                      isLoading={isLoading}
                      pendingConnector={pendingConnector}
                      error={error}
                    />
                  </CardMotionWrapper>
                ))}
              {!isDelegateConnection && (
                <CardMotionWrapper>
                  <DelegateCashButton />
                </CardMotionWrapper>
              )}
              {windowFuel && (
                <CardMotionWrapper key="fuel">
                  <FuelConnectorButtons />
                </CardMotionWrapper>
              )}
            </Stack>
          )}

          {isConnectedAndKeyPairReady && !keyPair && (
            <>
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                size="invisible"
              />
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
                    linkAddress.isLoading || set.isLoading || keyPair === undefined
                  }
                  isDisabled={keyPair === undefined}
                  loadingText={
                    keyPair === undefined
                      ? "Looking for keypairs"
                      : "Check your wallet"
                  }
                >
                  {isAddressLink ? "Link address" : "Verify address"}
                </ModalButton>
              </Box>
            </>
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
                <Link
                  href="/terms-and-conditions"
                  fontWeight={"semibold"}
                  onClick={onClose}
                >
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
