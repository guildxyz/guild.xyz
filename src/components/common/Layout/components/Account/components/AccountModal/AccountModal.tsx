import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Heading,
  HStack,
  Icon,
  IconButton,
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
  Tooltip,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import CopyableAddress from "components/common/CopyableAddress"
import GuildAvatar from "components/common/GuildAvatar"
import Modal from "components/common/Modal"
import useUser from "components/[guild]/hooks/useUser"
import { injected } from "connectors"
import { Question, TrashSimple } from "phosphor-react"
import { useContext, useEffect, useRef, useState } from "react"
import { Web3Connection } from "../../../../../../_app/Web3ConnectionManager"
import useUpdateUser from "./hooks/useUpdateUser"

const AccountModal = ({ isOpen, onClose }) => {
  const { account, connector } = useWeb3React()
  const { openWalletSelectorModal } = useContext(Web3Connection)
  const { isLoading, addresses } = useUser()
  const { onSubmit, response } = useUpdateUser()
  const modalFooterBg = useColorModeValue("gray.100", "gray.800")

  const [addressToRemove, setAddressToRemove] = useState(null)
  const alertCancelRef = useRef()
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const onAlertClose = () => {
    setAddressToRemove(null)
    setIsAlertOpen(false)
  }
  const handleWalletProviderSwitch = () => {
    openWalletSelectorModal()
    onClose()
  }

  const onRemoveClick = (address: string) => {
    setAddressToRemove(address)
    setIsAlertOpen(true)
  }

  const removeAddress = (address) =>
    onSubmit({
      addresses: addresses.filter((_address) => _address !== address),
    })

  const handleDelete = () => {
    removeAddress(addressToRemove)
  }

  useEffect(() => {
    if (response?.ok) onAlertClose()
  }, [response])

  return (
    <>
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
                Connected with{" "}
                {connector === injected ? "MetaMask" : "WalletConnect"}
              </Text>
              <Button
                size="sm"
                variant="outline"
                onClick={handleWalletProviderSwitch}
              >
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
                      <HStack key={address} spacing={4} alignItems="center" w="full">
                        <GuildAvatar address={address} size={6} />
                        <CopyableAddress
                          address={address}
                          decimals={5}
                          fontSize="md"
                        />
                        <Tooltip label="Remove address" placement="top" hasArrow>
                          <IconButton
                            rounded="full"
                            variant="ghost"
                            size="sm"
                            icon={<Icon as={TrashSimple} />}
                            colorScheme="red"
                            ml="auto !important"
                            onClick={() => onRemoveClick(address)}
                            aria-label="Remove address"
                          />
                        </Tooltip>
                      </HStack>
                    ))
                ) : (
                  <Text colorScheme="gray">
                    If you join a guild with another address, but with the same
                    Discord account, your addresses will be linked together and each
                    will be used for requirement checks.
                  </Text>
                )}
              </VStack>
            </ModalFooter>
          )}
        </ModalContent>
      </Modal>

      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={alertCancelRef}
        onClose={onAlertClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Remove account
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={alertCancelRef} onClick={onAlertClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

export default AccountModal
