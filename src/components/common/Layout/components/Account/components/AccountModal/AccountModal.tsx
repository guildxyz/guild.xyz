import {
  Button,
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
  useColorModeValue,
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
import LinkedAddress from "./components/LinkedAddress"

const AccountModal = ({ isOpen, onClose }) => {
  const { account, connector } = useWeb3React()
  const { openWalletSelectorModal } = useContext(Web3Connection)
  const { isLoading, addresses } = useUser()
  const modalFooterBg = useColorModeValue("gray.100", "gray.800")

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
              Connected with {connector === injected ? "MetaMask" : "WalletConnect"}
            </Text>
            <Button size="sm" variant="outline" onClick={handleWalletProviderSwitch}>
              Switch
            </Button>
          </Stack>
        </ModalBody>
        {addresses?.length && (
          <ModalFooter bg={modalFooterBg} flexDir="column" pt="10">
            <Stack direction="row" spacing={2} alignItems="center" mb={7}>
              <Heading as="h3" fontSize="lg">
                Linked addresses
              </Heading>
              {addresses?.length > 1 && (
                <Popover placement="top" trigger="hover">
                  <PopoverTrigger>
                    <Icon as={Question} />
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverArrow />
                    <PopoverBody>
                      If you join a guild with another address, but with the same
                      Discord account, your addresses will be linked together and
                      each will be used for requirement checks.
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              )}
            </Stack>
            <VStack spacing={4} alignItems="start" w="full">
              {!addresses && isLoading ? (
                <Spinner />
              ) : addresses?.length > 1 ? (
                addresses
                  .filter(
                    (address) => address?.toLowerCase() !== account.toLowerCase()
                  )
                  .map((address) => (
                    <LinkedAddress key={address} address={address} />
                  ))
              ) : (
                <Text colorScheme="gray">
                  If you join a guild with another address, but with the same Discord
                  account, your addresses will be linked together and each will be
                  used for requirement checks.
                </Text>
              )}
            </VStack>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  )
}

export default AccountModal
