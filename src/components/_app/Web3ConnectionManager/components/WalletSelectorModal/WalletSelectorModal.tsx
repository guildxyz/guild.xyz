import {
  Icon,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react"
import {
  useRumAction,
  WithRumComponentContext,
} from "@datadog/rum-react-integration"
import MetaMaskOnboarding from "@metamask/onboarding"
import { useWeb3React } from "@web3-react/core"
import { Error } from "components/common/Error"
import Link from "components/common/Link"
import { Modal } from "components/common/Modal"
import { connectors } from "connectors"
import { ArrowSquareOut } from "phosphor-react"
import React, { useEffect, useRef, useState } from "react"
import { WalletError } from "types"
import ConnectorButton from "./components/ConnectorButton"
import processConnectionError from "./utils/processConnectionError"

type Props = {
  isModalOpen: boolean
  closeModal: () => void
  openNetworkModal: () => void
}

const WalletSelectorModal = ({
  isModalOpen,
  closeModal,
  openNetworkModal, // Passing as prop to avoid dependency cycle
}: Props): JSX.Element => {
  const addDatadogAction = useRumAction("trackingAppAction")

  const { isActive } = useWeb3React()
  const [error, setError] = useState<WalletError & Error>(null)

  // initialize metamask onboarding
  const onboarding = useRef<MetaMaskOnboarding>()
  if (typeof window !== "undefined") {
    onboarding.current = new MetaMaskOnboarding()
  }

  useEffect(() => {
    if (isActive) closeModal()
  }, [isActive, closeModal])

  const closeModalAndSendAction = () => {
    closeModal()
    addDatadogAction("Wallet selector modal closed")
  }

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={closeModalAndSendAction}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Connect to a wallet</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Error error={error} processError={processConnectionError} />
            <Stack spacing="4">
              {connectors.map(([connector, connectorHooks], index) => (
                <ConnectorButton
                  key={index}
                  connector={connector}
                  connectorHooks={connectorHooks}
                  error={error}
                  setError={setError}
                />
              ))}
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Text textAlign="center" w="full">
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
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default WithRumComponentContext("WalletSelectorModal", WalletSelectorModal)
