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
import { Web3Connection } from "components/_app/Web3ConnectionManager"
import { Chains, supportedChains } from "connectors"
import useToast from "hooks/useToast"
import { useContext } from "react"
import NetworkButton from "./components/NetworkButton"
import requestNetworkChange from "./utils/requestNetworkChange"

const NetworkModal = ({ isOpen, onClose }) => {
  const { listedChainIDs } = useContext(Web3Connection)

  const modalSize = useBreakpointValue({ base: "lg", md: "2xl", lg: "4xl" })

  const { connector, isActive } = useWeb3React()
  const toast = useToast()

  const requestManualNetworkChange = (chain) => () =>
    toast({
      title: "Your wallet doesn't support switching chains automatically",
      description: `Please switch to ${chain} from your wallet manually!`,
      status: "error",
    })

  const listedChains =
    listedChainIDs?.length > 0
      ? supportedChains?.filter((chain) => listedChainIDs?.includes(Chains[chain]))
      : supportedChains

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={modalSize}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {isActive ? "Supported networks" : "Select network"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {!listedChainIDs?.length && (
            <Text mb={8}>
              It doesn't matter which supported chain you're connected to, it's only
              used to know your address and sign messages so each will work equally.
            </Text>
          )}
          <SimpleGrid columns={{ md: 2, lg: 3 }} spacing={{ base: 3, md: "18px" }}>
            {listedChains.map((chain) => (
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
