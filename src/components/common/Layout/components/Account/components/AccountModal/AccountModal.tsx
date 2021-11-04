import {
  Button,
  CloseButton,
  Heading,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import CopyableAddress from "components/common/CopyableAddress"
import GuildAvatar from "components/common/GuildAvatar"
import Modal from "components/common/Modal"
import useUser from "components/[guild]/hooks/useUser"
import { injected } from "connectors"
import { useContext } from "react"
import { Web3Connection } from "../../../../../../_app/Web3ConnectionManager"
import useUpdateUser from "./hooks/useUpdateUser"

const AccountModal = ({ isOpen, onClose }) => {
  const { account, connector } = useWeb3React()
  const { openWalletSelectorModal } = useContext(Web3Connection)
  const { isLoading, user } = useUser()
  const { onSubmit: onUpdate } = useUpdateUser()

  const handleWalletProviderSwitch = () => {
    openWalletSelectorModal()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Account</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack mb={12} direction="row" spacing="4" alignItems="center">
            <GuildAvatar address={account} />
            <CopyableAddress address={account} decimals={5} fontSize="2xl" />
          </Stack>

          <Heading as="h3" fontSize="lg" mb={8}>
            Authenticated addresses
          </Heading>
          <VStack spacing={4} alignItems="start">
            {isLoading ? (
              <Spinner />
            ) : (
              user?.addresses.map((address) => (
                <Stack key={address} direction="row" spacing="4" alignItems="center">
                  <GuildAvatar address={address} size={6} />
                  <CopyableAddress address={address} decimals={5} fontSize="md" />
                  <CloseButton
                    rounded="full"
                    onClick={() =>
                      onUpdate({
                        addresses: user.addresses.filter(
                          (_address) => _address !== address
                        ),
                      })
                    }
                  />
                </Stack>
              ))
            )}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Text colorScheme="gray" fontSize="sm" fontWeight="medium">
              Connected with {connector === injected ? "MetaMask" : "WalletConnect"}
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
