import {
  HStack,
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
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import CopyableAddress from "components/common/CopyableAddress"
import GuildAvatar from "components/common/GuildAvatar"
import { Modal } from "components/common/Modal"
import useUser from "components/[guild]/hooks/useUser"
import { injected, walletConnect, walletLink } from "connectors"
import { SignOut } from "phosphor-react"
import { useContext } from "react"
import { Web3Connection } from "../../../../../../_app/Web3ConnectionManager"
import AccountConnections from "./components/AccountConnections"

const AccountModal = ({ isOpen, onClose }) => {
  const { account, connector, deactivate } = useWeb3React()
  const { openWalletSelectorModal } = useContext(Web3Connection)
  const { discordId, telegramId, isLoading } = useUser()
  const modalFooterBg = useColorModeValue("gray.100", "gray.800")

  const handleWalletProviderSwitch = () => {
    openWalletSelectorModal()
    onClose()
  }

  const connectorName = (c) => {
    switch (c) {
      case injected:
        return "MetaMask"
      case walletConnect:
        return "WalletConnect"
      case walletLink:
        return "Coinbase Wallet"
      default:
        return ""
    }
  }

  const handleLogout = () => {
    deactivate()

    const keysToRemove = Object.keys({ ...window.localStorage }).filter((key) =>
      /^dc_auth_[a-z]*$/.test(key)
    )

    keysToRemove.forEach((key) => {
      window.localStorage.removeItem(key)
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Account</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack mb={9} direction="row" spacing="4" alignItems="center">
            <GuildAvatar address={account} />
            <CopyableAddress address={account} decimals={5} fontSize="2xl" />
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mb="-1"
          >
            <Text colorScheme="gray" fontSize="sm" fontWeight="medium">
              {`Connected with ${connectorName(connector)}`}
            </Text>
            <HStack>
              <Button
                size="sm"
                variant="outline"
                onClick={handleWalletProviderSwitch}
              >
                Switch
              </Button>
              <Tooltip label="Disconnect">
                <IconButton
                  size="sm"
                  variant="outline"
                  onClick={handleLogout}
                  icon={<Icon as={SignOut} p="1px" />}
                  aria-label="Disconnect"
                />
              </Tooltip>
            </HStack>
          </Stack>
        </ModalBody>
        {(discordId || telegramId || isLoading) && (
          <ModalFooter bg={modalFooterBg} flexDir="column" pt="10">
            <AccountConnections />
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  )
}

export default AccountModal
