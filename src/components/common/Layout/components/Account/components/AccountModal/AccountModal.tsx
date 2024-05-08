import {
  Center,
  Circle,
  Divider,
  HStack,
  Icon,
  IconButton,
  Img,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import useUser, { useUserPublic } from "components/[guild]/hooks/useUser"
import CopyCWaaSBackupData from "components/_app/Web3ConnectionManager/components/WalletSelectorModal/components/GoogleLoginButton/components/CopyCWaaSBackupData"
import useConnectorNameAndIcon from "components/_app/Web3ConnectionManager/hooks/useConnectorNameAndIcon"
import useWeb3ConnectionManager from "components/_app/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import Button from "components/common/Button"
import CopyableAddress from "components/common/CopyableAddress"
import GuildAvatar from "components/common/GuildAvatar"
import { Modal } from "components/common/Modal"
import useResolveAddress from "hooks/useResolveAddress"
import { deleteKeyPairFromIdb } from "hooks/useSetKeyPair"
import { useAtom } from "jotai"
import { LinkBreak, SignOut } from "phosphor-react"
import { useAccount } from "wagmi"
import { CHAIN_CONFIG, Chains } from "wagmiConfig/chains"
import { WAAS_CONNECTOR_ID } from "wagmiConfig/waasConnector"
import { accountModalAtom } from "."
import NetworkModal from "../NetworkModal"
import AccountConnections from "./components/AccountConnections"
import UsersGuildPins from "./components/UsersGuildCredentials"

const AccountModal = () => {
  const { address, type, disconnect } = useWeb3ConnectionManager()
  const [isOpen, setIsOpen] = useAtom(accountModalAtom)
  const onClose = () => setIsOpen(false)

  const { address: evmAddress, chainId, connector } = useAccount()

  const {
    isOpen: isNetworkModalOpen,
    onOpen: openNetworkModal,
    onClose: closeNetworkModal,
  } = useDisclosure()
  const { id } = useUser()
  const { deleteKeys } = useUserPublic()

  const handleLogout = () => {
    const keysToRemove = Object.keys({ ...window.localStorage }).filter((key) =>
      /^dc_auth_[a-z]*$/.test(key)
    )

    keysToRemove.forEach((key) => {
      window.localStorage.removeItem(key)
    })

    deleteKeyPairFromIdb(id)
      ?.catch(() => {})
      .finally(() => {
        onClose()
        disconnect()
        deleteKeys()
      })
  }

  const domain = useResolveAddress(evmAddress)

  const avatarBg = useColorModeValue("gray.100", "blackAlpha.200")

  const { connectorName } = useConnectorNameAndIcon()

  return (
    <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader pb="6">Account</ModalHeader>
        <ModalCloseButton />
        {address ? (
          <>
            <ModalBody className="custom-scrollbar">
              <HStack spacing="3" alignItems="center" mb="8">
                <Circle size={12} bg={avatarBg}>
                  <GuildAvatar address={address} size={5} />
                </Circle>
                <Stack w="full" alignItems={"flex-start"} spacing="1">
                  <HStack>
                    <CopyableAddress
                      address={address}
                      domain={domain}
                      decimals={5}
                      fontWeight="bold"
                    />
                  </HStack>
                  <HStack spacing="1">
                    <Text
                      colorScheme="gray"
                      fontSize="sm"
                      fontWeight="medium"
                      noOfLines={1}
                    >
                      {`Connected with ${connectorName} on`}
                    </Text>
                    {type === "EVM" ? (
                      <Button
                        variant="ghost"
                        p="0"
                        onClick={openNetworkModal}
                        size="xs"
                        mt="-2px"
                      >
                        <Center>
                          {CHAIN_CONFIG[Chains[chainId]] ? (
                            <Img
                              src={CHAIN_CONFIG[Chains[chainId]].iconUrl}
                              boxSize={4}
                            />
                          ) : (
                            <Icon as={LinkBreak} />
                          )}
                        </Center>
                      </Button>
                    ) : (
                      <Center ml={1}>
                        <Img src="/walletLogos/fuel.svg" boxSize={4} />
                      </Center>
                    )}
                  </HStack>
                  <NetworkModal
                    isOpen={isNetworkModalOpen}
                    onClose={closeNetworkModal}
                  />
                </Stack>
                <HStack spacing={1}>
                  {connector?.id === WAAS_CONNECTOR_ID && <CopyCWaaSBackupData />}
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
              </HStack>

              <AccountConnections />
              <Divider my="7" />
              <UsersGuildPins />
            </ModalBody>
          </>
        ) : (
          <ModalBody>
            <Text mb="6" fontSize={"2xl"} fontWeight="semibold">
              Not connected
            </Text>
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  )
}

export default AccountModal
