import {
  Button,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Tooltip,
  useClipboard,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Modal from "components/common/Modal"
import { useContext } from "react"
import shortenHex from "utils/shortenHex"
import { Web3Connection } from "../../../../../../_app/Web3ConnectionManager"
import Identicon from "../Identicon"

const AccountModal = ({ isOpen, onClose }) => {
  const { account } = useWeb3React()
  const { openModal } = useContext(Web3Connection)
  const { hasCopied, onCopy } = useClipboard(account)

  const handleWalletProviderSwitch = () => {
    openModal()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Account</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack direction="row" spacing="4" alignItems="center">
            <Identicon address={account} />
            <Tooltip
              placement="top"
              label={hasCopied ? "Copied" : "Click to copy address"}
              closeOnClick={false}
              hasArrow
            >
              <Button onClick={onCopy} variant="unstyled">
                <Text fontSize="2xl" fontWeight="semibold">
                  {shortenHex(account, 5)}
                </Text>
              </Button>
            </Tooltip>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Text colorScheme="gray" fontSize="sm" fontWeight="medium">
              Connected with MetaMask
            </Text>
            <Button size="sm" variant="outline" onClick={handleWalletProviderSwitch}>
              Switch
            </Button>
          </Stack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default AccountModal
