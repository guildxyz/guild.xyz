import {
  Button,
  CloseButton,
  Heading,
  Icon,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
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
import { Question } from "phosphor-react"
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

          <Stack direction="row" spacing={2} alignItems="center" mb={4}>
            <Heading as="h3" fontSize="lg">
              More authenticated addresses
            </Heading>
            <Popover placement="top">
              <PopoverTrigger>
                <Icon as={Question} />
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverBody>
                  If you join a guild with another wallet, but with the same Discord
                  ID, we will link your wallet addresses, and you will see all of
                  them here.
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </Stack>
          <VStack spacing={4} alignItems="start">
            {isLoading ? (
              <Spinner />
            ) : (
              <>
                {user?.addresses?.length > 0 ? (
                  user.addresses
                    ?.filter(
                      (address) => address?.toLowerCase() !== account.toLowerCase()
                    )
                    .map((address) => (
                      <Stack
                        key={address}
                        direction="row"
                        spacing={4}
                        alignItems="center"
                      >
                        <GuildAvatar address={address} size={6} />
                        <CopyableAddress
                          address={address}
                          decimals={5}
                          fontSize="md"
                        />
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
                ) : (
                  <Text colorScheme="gray">
                    You do not have any authenticated addresses yet.
                  </Text>
                )}
              </>
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
