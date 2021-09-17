import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import { Error } from "components/common/Error"
import Modal from "components/common/Modal"
import processConnectionError from "components/_app/Web3ConnectionManager/components/WalletSelectorModal/utils/processConnectionError"
import { injected, supportedChains, walletConnect } from "connectors"
import useToast from "hooks/useToast"
import NetworkButton from "./components/NetworkButton"
import requestNetworkChange from "./utils/requestNetworkChange"

const NetworkModal = ({ isOpen, onClose }) => {
  const { error, connector } = useWeb3React()
  const toast = useToast()

  const requestManualNetworkChange = (chain) => () =>
    toast({
      title: "Your wallet doesn't support switching chains automatically",
      description: `Please switch to ${chain} from your wallet manually!`,
      status: "error",
      duration: 4000,
    })

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {connector === walletConnect ? "Supported networks" : "Select network"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Error error={error} processError={processConnectionError} />
          <Stack spacing={3}>
            {supportedChains.map((chain) => (
              <NetworkButton
                key={chain}
                chain={chain}
                requestNetworkChange={
                  connector === injected
                    ? requestNetworkChange(chain, onClose)
                    : requestManualNetworkChange(chain)
                }
              />
            ))}
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default NetworkModal
