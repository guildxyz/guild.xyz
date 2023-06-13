import {
  Circle,
  Divider,
  HStack,
  Icon,
  IconButton,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react"
import { CoinbaseWallet } from "@web3-react/coinbase-wallet"
import { useWeb3React } from "@web3-react/core"
import { MetaMask } from "@web3-react/metamask"
import { WalletConnect } from "@web3-react/walletconnect"
import { WalletConnect as WalletConnectV2 } from "@web3-react/walletconnect-v2"
import useUser from "components/[guild]/hooks/useUser"
import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"
import CopyableAddress from "components/common/CopyableAddress"
import GuildAvatar from "components/common/GuildAvatar"
import { Modal } from "components/common/Modal"
import useResolveAddress from "hooks/resolving/useResolveAddress"
import { deleteKeyPairFromIdb } from "hooks/useKeyPair"
import { SignOut } from "phosphor-react"
import AccountConnections from "./components/AccountConnections"
import PrimaryAddressTag from "./components/PrimaryAddressTag"
import UsersGuildPins from "./components/UsersGuildCredentials"

const AccountModal = () => {
  const { account, connector } = useWeb3React()
  const {
    setIsDelegateConnection,
    isAccountModalOpen: isOpen,
    closeAccountModal: onClose,
  } = useWeb3ConnectionManager()
  const { id, addresses } = useUser()

  const connectorName = (c) =>
    c instanceof MetaMask
      ? typeof window !== "undefined" && (window.ethereum as any)?.isBraveWallet
        ? "Brave Wallet"
        : "MetaMask"
      : c instanceof WalletConnect
      ? "WalletConnect"
      : c instanceof WalletConnectV2
      ? "WalletConnect V2"
      : c instanceof CoinbaseWallet
      ? "Coinbase Wallet"
      : ""

  const handleLogout = () => {
    setIsDelegateConnection(false)
    onClose()
    connector.resetState()
    connector.deactivate?.()

    const keysToRemove = Object.keys({ ...window.localStorage }).filter((key) =>
      /^dc_auth_[a-z]*$/.test(key)
    )

    keysToRemove.forEach((key) => {
      window.localStorage.removeItem(key)
    })

    deleteKeyPairFromIdb(id).catch(() => {})
  }

  const domain = useResolveAddress(account)

  const avatarBg = useColorModeValue("blackAlpha.100", "blackAlpha.200")

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      colorScheme="duotone"
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader pb="6">Account</ModalHeader>
        <ModalCloseButton />
        {account ? (
          <>
            <ModalBody>
              <HStack spacing="3" alignItems="center" mb="8">
                <Circle size={12} bg={avatarBg}>
                  <GuildAvatar address={account} size={5} />
                </Circle>
                <Stack w="full" alignItems={"flex-start"} spacing="1">
                  <CopyableAddress
                    address={account}
                    domain={domain}
                    decimals={5}
                    fontWeight="bold"
                    // fontSize="lg"
                  />
                  <Text colorScheme="gray" fontSize="sm" fontWeight="medium">
                    {`Connected with ${connectorName(connector)}`}
                  </Text>
                </Stack>
                {addresses?.indexOf(account.toLowerCase()) === 0 &&
                addresses.length > 1 ? (
                  <PrimaryAddressTag />
                ) : null}
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
              {/* <Divider my="7" /> */}

              <AccountConnections />
              <Divider my="7" />
              <UsersGuildPins />
            </ModalBody>
            {/* <ModalFooter flexDir="column" pt="10" gap={8}>

            </ModalFooter> */}
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
