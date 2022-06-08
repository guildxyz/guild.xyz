import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import { WalletConnect } from "@web3-react/walletconnect"
import { Modal } from "components/common/Modal"
import { supportedChains } from "connectors"
import useToast from "hooks/useToast"
import NetworkButton from "./components/NetworkButton"
import requestNetworkChange from "./utils/requestNetworkChange"

const NetworkModal = ({ isOpen, onClose }) => {
  const modalSize = useBreakpointValue({ base: "lg", md: "2xl", lg: "4xl" })

  const { /* error, */ connector, isActive } = useWeb3React()
  const toast = useToast()

  const requestManualNetworkChange = (chain) => () =>
    toast({
      title: "Your wallet doesn't support switching chains automatically",
      description: `Please switch to ${chain} from your wallet manually!`,
      status: "error",
    })

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={modalSize}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {isActive ? "Supported networks" : "Select network"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb={8}>
            It doesn't matter which supported chain you're connected to, it's only
            used to know your address and sign messages so each will work equally.
          </Text>
          {/* <Error error={error} processError={processConnectionError} /> */}
          <SimpleGrid columns={{ md: 2, lg: 3 }} spacing={{ base: 3, md: "18px" }}>
            {supportedChains.map((chain) => (
              <NetworkButton
                key={chain}
                chain={chain}
                requestNetworkChange={
                  connector instanceof WalletConnect
                    ? requestManualNetworkChange(chain)
                    : requestNetworkChange(chain, onClose)
                }
              />
            ))}
          </SimpleGrid>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default NetworkModal
