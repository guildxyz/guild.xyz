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
import MetaMaskOnboarding from "@metamask/onboarding"
// eslint-disable-next-line import/no-extraneous-dependencies
import { AbstractConnector } from "@web3-react/abstract-connector"
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core"
import { Error } from "components/common/Error"
import Link from "components/common/Link"
import Modal from "components/common/Modal"
import { injected, walletConnect } from "connectors"
import { ArrowSquareOut } from "phosphor-react"
import React, { useEffect, useRef } from "react"
import ConnectorButton from "./components/ConnectorButton"
import processConnectionError from "./utils/processConnectionError"

type Props = {
  activatingConnector: AbstractConnector
  setActivatingConnector: (connector: AbstractConnector) => void
  isModalOpen: boolean
  closeModal: () => void
  openNetworkModal: () => void
}

const WalletSelectorModal = ({
  activatingConnector,
  setActivatingConnector,
  isModalOpen,
  closeModal,
  openNetworkModal, // Passing as prop to avoid dependency cycle
}: Props): JSX.Element => {
  const { error } = useWeb3React()
  const { active, activate, connector, setError } = useWeb3React()

  // initialize metamask onboarding
  const onboarding = useRef<MetaMaskOnboarding>()
  if (typeof window !== "undefined") {
    onboarding.current = new MetaMaskOnboarding()
  }

  const handleConnect = (provider) => {
    setActivatingConnector(provider)
    activate(provider, undefined, true).catch((err) => {
      setActivatingConnector(undefined)
      setError(err)
    })
  }
  const handleOnboarding = () => onboarding.current?.startOnboarding()

  useEffect(() => {
    if (active) closeModal()
  }, [active, closeModal])

  useEffect(() => {
    if (error instanceof UnsupportedChainIdError) {
      closeModal()
      openNetworkModal()
    }
  }, [error, openNetworkModal, closeModal])

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Connect to a wallet</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Error error={error} processError={processConnectionError} />
            <Stack spacing="4">
              <ConnectorButton
                name={
                  typeof window !== "undefined" &&
                  MetaMaskOnboarding.isMetaMaskInstalled()
                    ? "MetaMask"
                    : "Install MetaMask"
                }
                onClick={
                  typeof window !== "undefined" &&
                  MetaMaskOnboarding.isMetaMaskInstalled()
                    ? () => handleConnect(injected)
                    : handleOnboarding
                }
                iconUrl="metamask.png"
                disabled={connector === injected || !!activatingConnector}
                isActive={connector === injected}
                isLoading={activatingConnector === injected}
              />
              <ConnectorButton
                name="WalletConnect"
                onClick={() => handleConnect(walletConnect)}
                iconUrl="walletconnect.svg"
                disabled={connector === walletConnect || !!activatingConnector}
                isActive={connector === walletConnect}
                isLoading={activatingConnector === walletConnect}
              />
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Text textAlign="center">
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

export default WalletSelectorModal
